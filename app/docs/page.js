import { Header } from "@/components/header";
import Footer from "@/components/footer";
import DocsWidget from "@/components/docs_widget";

export const metadata = {
  title: "Geiger Docs",
  description: "Documentation for the full Geiger product suite.",
};

export default function DocsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <Header />
      <main className="relative z-10 flex-1 pt-20">
        <DocsWidget />
      </main>
      <Footer />
    </div>
  );
}
