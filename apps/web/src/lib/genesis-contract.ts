/**
 * Resolves the Genesis ERC-721 contract address from the environment.
 *
 * Two variants:
 *
 *   - `requireGenesisContract()` throws on missing / placeholder / invalid.
 *     Use this in server handlers (API routes) at the **start of the request
 *     handler body** — never at module top level. Calling at module load
 *     blocks the Next.js build during "Collect page data" if the env var
 *     isn't set on the build environment (preview branches, CI).
 *
 *   - `tryGetGenesisContract()` returns the address or `null`. Never throws.
 *     Use this in client components so render doesn't crash when previewing
 *     a build that doesn't have the env var configured.
 *
 * Why fail-fast at all: a missing GENESIS_CONTRACT_ADDRESS used to silently
 * fall back to `0x2222...2222`, which caused mint transactions to go to a
 * non-existent contract and MetaMask `wallet_watchAsset` to fail with
 * "ownership details do not match". Failing loudly at first actual use
 * forces config to be correct without breaking builds for preview branches.
 */

const PLACEHOLDER = '0x2222222222222222222222222222222222222222'

function validate(v: string | undefined): `0x${string}` | { error: string } {
  if (!v) {
    return {
      error:
        'NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS is not set. ' +
        'Add the deployed Genesis ERC-721 contract address (Base Sepolia) ' +
        'to apps/web/.env.local (or your Vercel project env vars) and restart.',
    }
  }
  if (v === PLACEHOLDER) {
    return {
      error:
        'NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS is set to the all-2s placeholder. ' +
        'Replace it with the deployed Genesis ERC-721 contract address ' +
        '(Base Sepolia).',
    }
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(v)) {
    return {
      error:
        `NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS is not a valid 0x-prefixed 40-hex address: "${v}".`,
    }
  }
  return v as `0x${string}`
}

export function requireGenesisContract(): `0x${string}` {
  const result = validate(process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS)
  if (typeof result === 'object' && 'error' in result) {
    throw new Error(result.error)
  }
  return result
}

/** Non-throwing variant for client components. Returns null if not configured. */
export function tryGetGenesisContract(): `0x${string}` | null {
  const result = validate(process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS)
  if (typeof result === 'object' && 'error' in result) {
    return null
  }
  return result
}

export const GENESIS_CONTRACT_PLACEHOLDER = PLACEHOLDER
