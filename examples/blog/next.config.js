/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ["catalyst-cms"],
};

module.exports = nextConfig;
