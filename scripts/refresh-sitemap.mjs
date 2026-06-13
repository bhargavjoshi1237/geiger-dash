const baseUrl = (process.env.SITE_URL || "https://geiger.studio").replace(/\/$/, "");
const secret = process.env.CRON_SECRET;

if (!secret) {
  console.error("CRON_SECRET is required.");
  process.exitCode = 1;
} else {
  const response = await fetch(`${baseUrl}/api/cron/refresh-sitemap`, {
    headers: {
      Authorization: `Bearer ${secret}`,
    },
  });

  const body = await response.text();

  if (!response.ok) {
    console.error(`Sitemap refresh failed (${response.status}): ${body}`);
    process.exitCode = 1;
  } else {
    console.log(body);
  }
}

