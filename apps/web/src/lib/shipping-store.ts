/**
 * Shipping address storage — Upstash Redis (via kv) with in-memory fallback.
 *
 * Key schema:
 *   shipping:claim:{claimId}   → ShippingAddress  (primary — verified by claimId)
 *   shipping:email:{email}     → ShippingAddress  (secondary — dashboard lookup)
 *
 * The claimId key is authoritative for fulfillment.
 * The email key is a convenience index; email is lower-cased before storage.
 */

import { kv } from '@/lib/kv'

export interface ShippingAddress {
  fullName: string
  line1: string
  line2?: string
  city: string
  /** State / Province */
  state: string
  postalCode: string
  /** ISO 3166-1 alpha-2, e.g. "US" */
  country: string
  /** For shipping notifications */
  phone?: string
  savedAt: string
  claimId: string
  email: string
}

function claimKey(claimId: string) {
  return `shipping:claim:${claimId}`
}

function emailKey(email: string) {
  return `shipping:email:${email.toLowerCase().trim()}`
}

export async function saveShippingAddress(addr: ShippingAddress): Promise<void> {
  await Promise.all([
    kv.set(claimKey(addr.claimId), addr),
    kv.set(emailKey(addr.email), addr),
  ])
}

export async function getShippingAddressByClaim(claimId: string): Promise<ShippingAddress | null> {
  return kv.get<ShippingAddress>(claimKey(claimId))
}

export async function getShippingAddressByEmail(email: string): Promise<ShippingAddress | null> {
  return kv.get<ShippingAddress>(emailKey(email))
}
