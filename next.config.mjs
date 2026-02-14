/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/notes',
        destination: 'https://geigernotes.vercel.app/notes',
      },
      {
        source: '/notes/:path*',
        destination: 'https://geigernotes.vercel.app/notes/:path*',
      },
      {
        source: '/assets',
        destination: 'https://geigerassets.vercel.app/assets',
      },
      {
        source: '/assets/:path*',
        destination: 'https://geigerassets.vercel.app/assets/:path*',
      },
    ]
  },
};

export default nextConfig;
