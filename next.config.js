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
  // Allow serving static JSON files from public/events
  async headers() {
    return [
      {
        source: '/events/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig