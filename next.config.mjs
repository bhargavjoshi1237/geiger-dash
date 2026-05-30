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
  async redirects() {
    // Office editor deep-links emitted without the /office prefix (e.g. a file
    // opened from the office workspace links to /document/:id). Redirect them to
    // the canonical /office/* path so they flow through the proven /office proxy
    // rewrite below. Note office's presentation route is /slide (singular).
    return [
      {
        source: "/document/:documentid",
        destination: "/office/document/:documentid",
        permanent: false,
      },
      {
        source: "/sheet/:sheetid",
        destination: "/office/sheet/:sheetid",
        permanent: false,
      },
      {
        source: "/slide/:slideid",
        destination: "/office/slide/:slideid",
        permanent: false,
      },
      {
        source: "/slides/:slideid",
        destination: "/office/slide/:slideid",
        permanent: false,
      },
    ];
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
        destination: "https://geigeroffice.vercel.app",
      },
      {
        source: "/office/:path*",
        destination: "https://geigeroffice.vercel.app/:path*",
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
