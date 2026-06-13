import Link from "next/link";
import Image from "next/image";

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
              <span className="font-bold text-lg tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">Geiger Studios</span>
            </div>
            <p className="text-foreground0 text-sm max-w-sm">
              Built to Manage. Designed to Create.
              <br /> Turn your ideas into something real with a single suite that combines solid management tools and easy-to-use creative features.
            </p>
          </div>
          
          <div>
            <h2 className="font-bold text-foreground mb-4">Products</h2>
            <ul className="space-y-3">
              <li><Link href="/notes" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Notes</Link></li>
              <li><Link href="/flow" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Flow</Link></li>
              <li><Link href="/assets" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Assets</Link></li>
              <li><Link href="/grey" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Grey</Link></li>
              <li><Link href="/office" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Office</Link></li>
              <li><Link href="/forms" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Forms</Link></li>
              <li><Link href="/events" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Events</Link></li>
              <li><Link href="/content" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Content</Link></li>
              <li><Link href="/campaign" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Campaign</Link></li>
              <li><Link href="/chat" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Chat</Link></li>
              <li><Link href="/canvas" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Canvas</Link></li>
              <li><Link href="/docs" className="hover:text-foreground transition-colors text-muted-foreground text-sm">Geiger Docs</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-foreground mb-4">Resources</h2>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
              <li><a href="mailto:support@geiger.studio" className="hover:text-foreground transition-colors">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-foreground mb-4">Company</h2>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground0">
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
