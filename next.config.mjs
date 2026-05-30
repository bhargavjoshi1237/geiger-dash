/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
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
        source: "/office",
        destination: "https://geigeroffice.vercel.app/office",
      },
      {
        source: "/office/:path*",
        destination: "https://geigeroffice.vercel.app/office/:path*",
      },
      {
        source: "/flow",
        destination: "https://geigerflow.vercel.app/flow",
      },
      {
        source: "/flow/:path*",
        destination: "https://geigerflow.vercel.app/flow/:path*",
      },
      {
        source: "/forms",
        destination: "https://geigerforms.vercel.app",
      },
      {
        source: "/forms/:path*",
        destination: "https://geigerforms.vercel.app/:path*",
      },
      {
        source: "/form/:path*",
        destination: "https://geigerforms.vercel.app/form/:path*",
      },
      {
        source: "/canvas",
        destination: "https://geigercanvas.vercel.app/canvas",
      },
      {
        source: "/canvas/:path*",
        destination: "https://geigercanvas.vercel.app/canvas/:path*",
      },
    ];
  },
};

export default nextConfig;
