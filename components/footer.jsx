import Link from "next/link";
import Image from "next/image";
import FooterProducts from "@/components/footer-products";

export default function Footer() {
  return (
   <div className="bg-background"> <footer className="w-full border-t border-border/50 bg-background pt-16 pb-8 relative z-30 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 flex items-center justify-center">
                <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg`} alt="Logo" width={20} height={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground dark:bg-gradient-to-r dark:from-zinc-100 dark:to-zinc-400 dark:bg-clip-text dark:text-transparent">
                Geiger Studios
              </span>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground">
              Built to Manage. Designed to Create.
              <br /> Turn your ideas into something real with a single suite that combines solid management tools and easy-to-use creative features.
            </p>
          </div>
          
          <div>
            <h2 className="font-bold text-foreground mb-4">Products</h2>
            <FooterProducts />
          </div>

          <div>
            <h2 className="font-bold text-foreground mb-4">Resources</h2>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><a href="mailto:support@geiger.studio" className="hover:text-foreground transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-foreground mb-4">Company</h2>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Change Log</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Geiger Studios. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-muted-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-muted-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
    <div className="mt-10 flex justify-center bg-background relative z-0"><h1 className="text-[13vw] font-bold text-foreground/5 dark:text-foreground/5 leading-none tracking-tighter select-none pointer-events-none">GEIGER STUDIO</h1></div>
    </div>
  );
}
