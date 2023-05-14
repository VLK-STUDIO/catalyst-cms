/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true
  },
  transpilePackages: ["catalyst-cms"]
};

module.exports = nextConfig;
