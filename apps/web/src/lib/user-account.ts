/**
 * User account — persistent identity record in KV.
 *
 * userId  = sha256(email)          when email is the anchor
 *         = sha256(evmAddress)     for wallet-only users (no email yet)
 *
 * KV key schema:
 *   user:{userId}              → UserAccount  (canonical record)
 *   user:email:{email}         → userId       (lookup by email)
 *   user:evm:{address}         → userId       (lookup by EVM address)
 *   user:cardano:{address}     → userId       (lookup by Cardano address)
 */

import { createHash } from 'crypto'
import { kv } from '@/lib/kv'

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserAccount = {
  userId: string
  email?: string
  evmAddresses: string[]
  cardanoAddresses: string[]
  /** Authoritative owned-hex inventory — appended on every purchase */
  hexIds: string[]
  createdAt: string
  updatedAt: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function makeUserId(identifier: string): string {
  return createHash('sha256').update(identifier.toLowerCase().trim()).digest('hex')
}

const K = {
  user:    (id: string)   => `user:${id}`,
  email:   (e: string)    => `user:email:${e.toLowerCase().trim()}`,
  evm:     (a: string)    => `user:evm:${a.toLowerCase()}`,
  cardano: (a: string)    => `user:cardano:${a.toLowerCase()}`,
}

// ── Core ops ──────────────────────────────────────────────────────────────────

export async function getUserById(userId: string): Promise<UserAccount | null> {
  return kv.get<UserAccount>(K.user(userId))
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const userId = await kv.get<string>(K.email(email))
  if (!userId) return null
  return getUserById(userId)
}

export async function getUserByEvmAddress(address: string): Promise<UserAccount | null> {
  const userId = await kv.get<string>(K.evm(address))
  if (!userId) return null
  return getUserById(userId)
}

export async function getUserByCardanoAddress(address: string): Promise<UserAccount | null> {
  const userId = await kv.get<string>(K.cardano(address))
  if (!userId) return null
  return getUserById(userId)
}

/**
 * Create or update a user account.
 * - If an account already exists for the email, merges addresses and hexIds.
 * - Writes all lookup indexes atomically.
 */
export async function upsertUserAccount(opts: {
  email?: string
  evmAddress?: string
  cardanoAddress?: string
  hexId?: string
}): Promise<UserAccount> {
  const { email, evmAddress, cardanoAddress, hexId } = opts

  // Determine userId: email takes precedence, then EVM, then Cardano
  const anchor = email ?? evmAddress ?? cardanoAddress
  if (!anchor) throw new Error('upsertUserAccount: at least one identifier is required')

  const userId = makeUserId(anchor)

  // Load existing account (may exist under a different anchor)
  let existing: UserAccount | null = null
  if (email) {
    existing = await getUserByEmail(email)
  }
  if (!existing && evmAddress) {
    existing = await getUserByEvmAddress(evmAddress)
  }
  if (!existing && cardanoAddress) {
    existing = await getUserByCardanoAddress(cardanoAddress)
  }

  const now = new Date().toISOString()

  const account: UserAccount = existing
    ? {
        ...existing,
        // Merge any new identifiers
        email: email ?? existing.email,
        evmAddresses: evmAddress && !existing.evmAddresses.includes(evmAddress.toLowerCase())
          ? [...existing.evmAddresses, evmAddress.toLowerCase()]
          : existing.evmAddresses,
        cardanoAddresses: cardanoAddress && !existing.cardanoAddresses.includes(cardanoAddress.toLowerCase())
          ? [...existing.cardanoAddresses, cardanoAddress.toLowerCase()]
          : existing.cardanoAddresses,
        hexIds: hexId && !existing.hexIds.includes(hexId)
          ? [...existing.hexIds, hexId]
          : existing.hexIds,
        updatedAt: now,
      }
    : {
        userId,
        email,
        evmAddresses: evmAddress ? [evmAddress.toLowerCase()] : [],
        cardanoAddresses: cardanoAddress ? [cardanoAddress.toLowerCase()] : [],
        hexIds: hexId ? [hexId] : [],
        createdAt: now,
        updatedAt: now,
      }

  // Write record + all lookup indexes
  await Promise.all([
    kv.set(K.user(account.userId), account),
    ...(account.email ? [kv.set(K.email(account.email), account.userId)] : []),
    ...account.evmAddresses.map((a) => kv.set(K.evm(a), account.userId)),
    ...account.cardanoAddresses.map((a) => kv.set(K.cardano(a), account.userId)),
  ])

  return account
}

/**
 * Append a hex to an existing account's owned inventory.
 * No-op if the account doesn't exist or already has the hex.
 */
export async function addHexToAccount(userId: string, hexId: string): Promise<void> {
  const account = await getUserById(userId)
  if (!account || account.hexIds.includes(hexId)) return
  const updated: UserAccount = {
    ...account,
    hexIds: [...account.hexIds, hexId],
    updatedAt: new Date().toISOString(),
  }
  await kv.set(K.user(userId), updated)
}

/**
 * Link a wallet address to an existing email-anchored account.
 * Used from the dashboard when the user connects a wallet after sign-in.
 */
export async function linkWalletToAccount(
  userId: string,
  opts: { evmAddress?: string; cardanoAddress?: string },
): Promise<UserAccount | null> {
  return upsertUserAccount({
    ...(await getUserById(userId) ?? {}),
    ...opts,
  } as Parameters<typeof upsertUserAccount>[0] & { email?: string })
}
