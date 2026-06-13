export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/studio/"],
    },
    sitemap: "https://geiger.studio/sitemap.xml",
    host: "https://geiger.studio",
  };
}

