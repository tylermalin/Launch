const path = require('path')
const fs = require('fs')

/**
 * Next.js only auto-loads `.env*` from `apps/web/`. Many monorepo setups keep secrets in the repo root.
 * Merge root `.env.local` / `.env` into process.env when a key is still unset (apps/web wins if both define it).
 */
function mergeRootEnv() {
  const repoRoot = path.join(__dirname, '..', '..')
  for (const name of ['.env.local', '.env']) {
    const full = path.join(repoRoot, name)
    if (!fs.existsSync(full)) continue
    const content = fs.readFileSync(full, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let val = trimmed.slice(eq + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      if (!key) continue
      if (process.env[key] === undefined || process.env[key] === '') {
        process.env[key] = val
      }
    }
  }
}

mergeRootEnv()


/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@meshsdk/core',
    '@meshsdk/core-cst',
    '@meshsdk/wallet',
    '@meshsdk/transaction',
    '@meshsdk/provider',
    '@meshsdk/common',
    '@cardano-sdk/crypto',
    'libsodium-wrappers-sumo',
    'libsodium-sumo',
    '@sidan-lab/sidan-csl-rs-nodejs',
    '@magic-sdk/admin',
    '@upstash/redis',
  ],
  reactStrictMode: true,
  transpilePackages: ['@meshsdk/react'],
  outputFileTracingIncludes: {
    '/api/**': [
      './node_modules/libsodium-sumo/dist/modules-sumo/**',
      './node_modules/libsodium-wrappers-sumo/dist/modules-sumo/**',
      './node_modules/@sidan-lab/sidan-csl-rs-nodejs/**',
    ],
  },
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl',
      '@react-native-async-storage/async-storage': './src/lib/stubs/async-storage-stub.js',
    },
  },
  allowedDevOrigins: ['192.168.1.126'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: 'gateway.pinata.cloud' },
    ],
  },
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MAGIC_API_KEY: process.env.NEXT_PUBLIC_MAGIC_API_KEY,
    NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    }
    config.output = {
      ...config.output,
      environment: {
        ...config.output.environment,
        asyncFunction: true,
        dynamicImport: true,
        module: true,
      },
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/lib/stubs/async-storage-stub.js'),
    }
    return config
  },
}

module.exports = nextConfig
