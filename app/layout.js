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
import { getActiveNotice } from "@/lib/notices/queries";

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

export default async function RootLayout({ children }) {
  // The above-the-topbar strip is driven by public.dash_notices — null when no
  // notice is live, which renders nothing. Manage it at /admin/notice; a client
  // component can still override it at runtime with useBanner().showBanner({…}).
  const notice = await getActiveNotice();

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
          <BannerProvider initial={notice}>
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
