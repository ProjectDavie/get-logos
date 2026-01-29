/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.api-sports.io"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
        port: '',
        pathname: '/**', // allow all paths under this hostname
      },
    ],
  },
};

module.exports = nextConfig;
