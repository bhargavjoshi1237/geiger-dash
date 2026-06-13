import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SystemFavicon } from "@/components/system-favicon";
import { Toaster } from "@/components/ui/sonner";

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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
