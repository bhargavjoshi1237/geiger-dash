/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/notes",
        destination: "https://geigernotes.vercel.app/notes",
      },
      {
        source: "/notes/:path*",
        destination: "https://geigernotes.vercel.app/notes/:path*",
      },
      {
        source: "/assets",
        destination: "https://geigerassets.vercel.app/assets",
      },
      {
        source: "/assets/:path*",
        destination: "https://geigerassets.vercel.app/assets/:path*",
      },
      {
        source: "/flow",
        destination: "https://geigerflow.vercel.app/flow",
      },
      {
        source: "/flow/:path*",
        destination: "https://geigerflow.vercel.app/flow/:path*",
      },
    ];
  },
};

export default nextConfig;
