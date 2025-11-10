/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    // If you prefer, you can use the simpler allow-list instead:
    // domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;
