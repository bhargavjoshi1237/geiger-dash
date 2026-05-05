import DocsWidget from "@/components/docs_widget";

export const metadata = {
  title: "Geiger Docs",
  description: "Documentation for the full Geiger product suite.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <DocsWidget />
    </div>
  );
}
