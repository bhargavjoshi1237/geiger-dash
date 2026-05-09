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
    <div className="min-h-screen bg-[#161616] font-sans text-white antialiased selection:bg-[#333333] selection:text-white">
      <DocsWidget navigation={navigation} page={page} />
    </div>
  );
}
