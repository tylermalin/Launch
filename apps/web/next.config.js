/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@meshsdk/core', '@sidan-lab/sidan-csl-rs-nodejs'],
  reactStrictMode: true,
  transpilePackages: ['@meshsdk/react', '@meshsdk/core-cst', '@cardano-sdk/crypto', 'libsodium-wrappers-sumo', 'libsodium-sumo'],
  turbopack: {
    resolveAlias: {
      'mapbox-gl': 'mapbox-gl',
      './libsodium-sumo.mjs': '../../node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs',
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
  },
  webpack: (config) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      './libsodium-sumo.mjs': require('path').resolve(__dirname, '../../node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs'),
    };
    return config;
  },
};

module.exports = nextConfig;
