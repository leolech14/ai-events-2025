/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages - no base path needed if using custom domain
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig