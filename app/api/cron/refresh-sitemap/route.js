import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  return Boolean(secret && authorization === `Bearer ${secret}`);
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag("sitemap-content", "max");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString(),
    sitemap: "https://geiger.studio/sitemap.xml",
  });
}

