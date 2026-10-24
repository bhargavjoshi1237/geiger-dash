import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@geiger/ui";
import { PublicPageHero } from "@/components/public-page-hero";
import { ChangelogFeed } from "@/components/changelog/changelog_feed";
import { getChangelogPage } from "@/lib/public-content/queries";

function FallbackRelease() {
  return {
    id: "fallback-release",
    version: "1.2.0",
    title: "Enhanced collaboration features",
    description:
      "Introducing real-time collaboration tools, sharper planning views, and improved sharing controls across the Geiger product suite.",
    category: "feature",
    product: "geiger-flow",
    release_date: "2026-03-14T00:00:00.000Z",
    is_featured: true,
    image_url: null,
    items: [],
  };
}

export default async function ChangelogPage() {
  // Only the newest page is server-rendered; the feed fetches older releases as the reader scrolls.
  const page = await getChangelogPage();
  const releases = page?.releases.length ? page.releases : [FallbackRelease()];
  const cursor = page?.releases.length ? page.nextCursor : null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808024_1px,transparent_1px),linear-gradient(to_bottom,#80808024_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_45%_at_50%_0%,#000_55%,transparent_100%)]" />
      <Header />

      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <PublicPageHero
          eyebrow="Product updates"
          title="Changelog"
          description="A running ledger of every meaningful change across Geiger, why it matters, and where the product is heading."
        />

        <ChangelogFeed initialReleases={releases} initialCursor={cursor} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Looking for implementation details?</p>
          <Button asChild variant="outline">
            <Link href="/help">
              Visit the Help Center
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
