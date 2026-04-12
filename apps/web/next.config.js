/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@meshsdk/core', '@sidan-lab/sidan-csl-rs-nodejs'],
  reactStrictMode: true,
  transpilePackages: ['@meshsdk/react', '@meshsdk/core-cst', '@cardano-sdk/crypto', 'libsodium-wrappers-sumo', 'libsodium-sumo'],
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl',
      './libsodium-sumo.mjs': '../../node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs',
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
    config.resolve.alias = {
      ...config.resolve.alias,
      './libsodium-sumo.mjs': path.resolve(__dirname, '../../node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs'),
      // MetaMask SDK references React Native async-storage in browser bundle; not needed on web.
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/lib/stubs/async-storage-stub.js'),
    };
    return config;
  },
};

module.exports = nextConfig;
