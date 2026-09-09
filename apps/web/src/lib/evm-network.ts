/**
 * Single source of truth for the active EVM network (Base mainnet vs Base Sepolia).
 *
 * GO LIVE BY FLIPPING ONE ENV VAR:  NEXT_PUBLIC_EVM_NETWORK=base
 * Defaults to `base-sepolia` (testnet) until explicitly set to `base`, so nothing
 * touches mainnet by accident.
 *
 * Every component/route that needs a chain, RPC, USDC token, Genesis contract,
 * or explorer/marketplace URL should import from here — never hardcode a network.
 *
 * Env:
 *   NEXT_PUBLIC_EVM_NETWORK            "base" (mainnet) | "base-sepolia" (default)
 *   NEXT_PUBLIC_GENESIS_CONTRACT_ADDRESS   Genesis ERC-721 for the ACTIVE network
 *   NEXT_PUBLIC_BASE_RPC_URL / BASE_RPC_URL                mainnet RPC
 *   NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL / BASE_SEPOLIA_RPC_URL testnet RPC
 */

import { base, baseSepolia, type Chain } from 'viem/chains'

export type EvmNetwork = 'base' | 'base-sepolia'

export function getEvmNetwork(): EvmNetwork {
  return process.env.NEXT_PUBLIC_EVM_NETWORK?.trim() === 'base' ? 'base' : 'base-sepolia'
}

export function isMainnet(): boolean {
  return getEvmNetwork() === 'base'
}

const CHAIN_ID: Record<EvmNetwork, number> = { base: 8453, 'base-sepolia': 84532 }

// Canonical USDC token (6 decimals) per network.
const USDC: Record<EvmNetwork, `0x${string}`> = {
  base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'base-sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
}

const EXPLORER: Record<EvmNetwork, string> = {
  base: 'https://basescan.org',
  'base-sepolia': 'https://sepolia.basescan.org',
}

const OPENSEA: Record<EvmNetwork, string> = {
  base: 'https://opensea.io/assets/base',
  'base-sepolia': 'https://testnets.opensea.io/assets/base-sepolia',
}

export function getEvmChain(): Chain {
  return isMainnet() ? base : baseSepolia
}

export function getEvmChainId(): number {
  return CHAIN_ID[getEvmNetwork()]
}

export function getUsdcAddress(): `0x${string}` {
  return USDC[getEvmNetwork()]
}

/** RPC URL for the active network (public var preferred, then server var, then public default). */
export function getEvmRpcUrl(): string {
  if (isMainnet()) {
    return (
      process.env.NEXT_PUBLIC_BASE_RPC_URL?.trim() ||
      process.env.BASE_RPC_URL?.trim() ||
      'https://mainnet.base.org'
    )
  }
  return (
    process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL?.trim() ||
    process.env.BASE_SEPOLIA_RPC_URL?.trim() ||
    'https://sepolia.base.org'
  )
}

export function getNetworkLabel(): string {
  return isMainnet() ? 'Base' : 'Base Sepolia'
}

export function getExplorerBase(): string {
  return EXPLORER[getEvmNetwork()]
}

export function getExplorerTxUrl(hash: string): string {
  return `${getExplorerBase()}/tx/${hash}`
}

export function getExplorerAddressUrl(addr: string): string {
  return `${getExplorerBase()}/address/${addr}`
}

export function getOpenSeaAssetUrl(contract: string, tokenId: string | number): string {
  return `${OPENSEA[getEvmNetwork()]}/${contract}/${tokenId}`
}

/** wallet_addEthereumChain params for MetaMask-style add/switch flows. */
export function getAddEthereumChainParams() {
  return {
    chainId: `0x${getEvmChainId().toString(16)}`,
    chainName: getNetworkLabel(),
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: [getEvmRpcUrl()],
    blockExplorerUrls: [getExplorerBase()],
  }
}
