/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: 'standalone',

  // Required for Mongoose 8.x compatibility (moved from experimental in Next.js 15)
  serverExternalPackages: ['mongoose'],

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: '/pana/[username]',
      loader: 'raw-loader',
    });

    // Important: return the modified config
    return config;
  },
};

module.exports = nextConfig;
