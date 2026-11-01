import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { displayFont } from "@/components/suite-landing/display_font";

export default function ContactLayout({ children }) {
  return (
    <div className={`${displayFont.variable} flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground`}>
      <Header />

      <main className="relative z-10 flex-1 px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
