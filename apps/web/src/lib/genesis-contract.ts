/**
 * Resolves the Genesis ERC-721 contract address from the environment.
 *
 * Throws if the env var is missing or still set to the all-2s placeholder.
 * This is intentionally loud: a missing GENESIS_CONTRACT_ADDRESS used to
 * silently fall back to `0x2222...2222`, which caused mint transactions
 * to go to a non-existent contract and MetaMask `wallet_watchAsset` to
 * fail with "ownership details do not match". Failing fast forces the
 * dev to set the env var instead of producing useless mints.
 */

const PLACEHOLDER = '0x2222222222222222222222222222222222222222'

export function requireGenesisContract(): `0x${string}` {
  const v = process.env.NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS
  if (!v) {
    throw new Error(
      'NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS is not set. ' +
        'Add the deployed Genesis ERC-721 contract address (Base Sepolia) ' +
        'to apps/web/.env.local and restart the dev server.',
    )
  }
  if (v === PLACEHOLDER) {
    throw new Error(
      'NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS is set to the all-2s placeholder. ' +
        'Replace it with the deployed Genesis ERC-721 contract address ' +
        '(Base Sepolia) in apps/web/.env.local, then restart the dev server.',
    )
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(v)) {
    throw new Error(
      `NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS is not a valid 0x-prefixed 40-hex address: "${v}". ` +
        'Check the value in apps/web/.env.local.',
    )
  }
  return v as `0x${string}`
}

export const GENESIS_CONTRACT_PLACEHOLDER = PLACEHOLDER
