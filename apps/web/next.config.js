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
  serverExternalPackages: ['@meshsdk/core', '@sidan-lab/sidan-csl-rs-nodejs', '@magic-sdk/admin'],
  reactStrictMode: true,
  transpilePackages: ['@meshsdk/react', '@meshsdk/core-cst', '@cardano-sdk/crypto', 'libsodium-wrappers-sumo', 'libsodium-sumo'],
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl',
      // resolved dynamically in webpack config; turbopack uses the same canonical package location
      './libsodium-sumo.mjs': require.resolve('libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs'),
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
    const path = require('path')
    // Mesh SDK / libsodium / WASM use async/await + top-level await; tell webpack the client supports them
    // (avoids noisy "target environment does not appear to support async/await" warnings).
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
    // Resolve libsodium-sumo via require.resolve so the path works regardless
    // of whether node_modules is at apps/web/ (Vercel Root Dir mode) or the
    // monorepo root (local workspace). The hardcoded ../../ path only works
    // in local monorepo context and breaks on Vercel.
    const libsodiumSumoDir = path.dirname(require.resolve('libsodium-sumo/package.json'));
    config.resolve.alias = {
      ...config.resolve.alias,
      './libsodium-sumo.mjs': path.join(libsodiumSumoDir, 'dist/modules-sumo-esm/libsodium-sumo.mjs'),
      // MetaMask SDK references React Native async-storage in browser bundle; not needed on web.
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/lib/stubs/async-storage-stub.js'),
    };
    return config;
  },
};

module.exports = nextConfig;
