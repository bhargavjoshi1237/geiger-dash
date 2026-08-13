import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SystemFavicon } from "@/components/system-favicon";
import { PlanBanner } from "@/components/billing/plan_banner";
// Subpath import: the barrel would drag every component (and their optional
// peer deps) into this server component's module graph.
import { BannerProvider, GlobalBanner } from "@geiger/ui/global-banner";
import { Toaster } from "@/components/ui/sonner";

// Demo notice for the above-the-topbar strip. Drop `initial` to start hidden and
// drive it from a client component with useBanner().showBanner({ … }).
const DEMO_BANNER = {
  message: "Scheduled maintenance on Sunday 02:00–04:00 UTC.",
  type: "warning",
  dismissible: true,
  link: { text: "See status", href: "/changelog" },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://geiger.studio"),
  title: {
    default: "Geiger Studios",
    template: "%s | Geiger Studios",
  },
  description: "Geiger Studios is a suite of tools for teams to plan, create, and collaborate. Built to Manage. Designed to Create",
  openGraph: {
    title: "Geiger Studios",
    description: "Geiger Studios is a suite of tools for teams to plan, create, and collaborate. Built to Manage. Designed to Create",
    url: "https://geiger.studio/",
    siteName: "Geiger Studios",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SystemFavicon />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BannerProvider initial={DEMO_BANNER}>
            <GlobalBanner />
            {children}
          </BannerProvider>
          <Suspense fallback={null}>
            <PlanBanner />
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
