import DocsWidget from "@/components/docs_widget";
import { getDocsPageWithNavigation } from "@/lib/docs/queries";

export const metadata = {
  title: {
    absolute: "Docs - Geiger Studio",
  },
  description: "Documentation for the full Geiger product suite.",
};

export default async function DocsPage() {
  const { navigation, page } = await getDocsPageWithNavigation("welcome");

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-surface-strong selection:text-foreground">
      <DocsWidget navigation={navigation} page={page} />
    </div>
  );
}
