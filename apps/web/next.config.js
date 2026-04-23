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

// ---------------------------------------------------------------------------
// libsodium-sumo path resolution
//
// We cannot use require.resolve('libsodium-sumo/dist/…') because the package's
// "exports" field doesn't list that subpath → ERR_PACKAGE_PATH_NOT_EXPORTED.
// We also cannot use a hardcoded ../../node_modules path because Vercel may
// install deps into apps/web/node_modules/ (Root Dir mode) or the monorepo
// root, depending on workspace configuration.
//
// Solution: probe candidate locations with fs.existsSync so we bypass
// Node's exports enforcement entirely.
// ---------------------------------------------------------------------------
const LIBSODIUM_SUMO_TAIL = 'libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs'

function findLibsodiumSumoMjs() {
  const candidates = [
    // Vercel workspace install — monorepo root node_modules
    path.resolve(__dirname, '../../node_modules', LIBSODIUM_SUMO_TAIL),
    // Vercel Root Dir install — apps/web/node_modules
    path.resolve(__dirname, 'node_modules', LIBSODIUM_SUMO_TAIL),
    // cwd fallback (wherever Vercel / npm sets process.cwd())
    path.resolve(process.cwd(), 'node_modules', LIBSODIUM_SUMO_TAIL),
    path.resolve(process.cwd(), '../../node_modules', LIBSODIUM_SUMO_TAIL),
  ]
  return candidates.find((p) => fs.existsSync(p)) ?? null
}

const libsodiumSumoMjs = findLibsodiumSumoMjs()

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@meshsdk/core', '@sidan-lab/sidan-csl-rs-nodejs', '@magic-sdk/admin'],
  reactStrictMode: true,
  transpilePackages: ['@meshsdk/react', '@meshsdk/core-cst', '@cardano-sdk/crypto', 'libsodium-wrappers-sumo', 'libsodium-sumo'],
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl',
      ...(libsodiumSumoMjs ? { './libsodium-sumo.mjs': libsodiumSumoMjs } : {}),
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
      ...(libsodiumSumoMjs ? { './libsodium-sumo.mjs': libsodiumSumoMjs } : {}),
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/lib/stubs/async-storage-stub.js'),
    }
    return config
  },
}

module.exports = nextConfig
