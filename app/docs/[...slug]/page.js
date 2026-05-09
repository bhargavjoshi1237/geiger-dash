import DocsWidget from "@/components/docs_widget";
import { getDocsPageWithNavigation } from "@/lib/docs/queries";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { page } = await getDocsPageWithNavigation(slug);

  return {
    title: {
      absolute: `${page.title} - Geiger Studio`,
    },
    description: page.description,
  };
}

export default async function DocsSlugPage({ params }) {
  const { slug } = await params;
  const { navigation, page } = await getDocsPageWithNavigation(slug);

  return (
    <div className="min-h-screen bg-[#161616] font-sans text-white antialiased selection:bg-[#333333] selection:text-white">
      <DocsWidget navigation={navigation} page={page} />
    </div>
  );
}
