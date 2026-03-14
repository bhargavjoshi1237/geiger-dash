import Link from "next/link";
import { ArrowRight, Box, Zap, Layers, Cpu, Calendar, Tag, Sparkles, Bug, Wrench, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { MegaMenu } from "@/components/mega-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import  Footer from "@/components/footer";

const categoryConfig = {
  feature: { icon: Sparkles, color: "emerald", label: "Feature" },
  improvement: { icon: Wrench, color: "blue", label: "Improvement" },
  bugfix: { icon: Bug, color: "amber", label: "Bug Fix" },
  breaking: { icon: AlertCircle, color: "red", label: "Breaking Change" }
};

const productColors = {
  'geiger-flow': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  'geiger-notes': 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
  'geiger-dash': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  'geiger-dam': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  'geiger-grey': 'from-gray-500/20 to-gray-600/20 border-gray-500/30'
};

const typeIcons = {
  added: "✓",
  changed: "⟳",
  fixed: "⚡",
  removed: "−",
  deprecated: "⚠"
};

export default async function ChangelogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch changelogs with their items
  const { data: changelogs } = await supabase
    .from('dash_changelog')
    .select(`
      *,
      items:dash_changelog_items (
        id,
        type,
        description
      )
    `)
    .order('release_date', { ascending: false });

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808030_1px,transparent_1px),linear-gradient(to_bottom,#80808030_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg`} alt="Logo" width={24} height={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">Geiger Studios</span>
            </Link>
          </div>
          <MegaMenu />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href={`/notes/${user.id}/home`}
                  className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  Dashboard
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-32 pb-20 px-6 mt-18">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16 ">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Changelog
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Stay up to date with the latest features, improvements, and fixes across the Geiger product suite.
            </p>
          </div>

          {/* Changelog List */}
          <div className="space-y-8">
            {changelogs?.map((changelog) => {
              const config = categoryConfig[changelog.category];
              const CategoryIcon = config.icon;
              
              return (
                <Card 
                  key={changelog.id}
                  className={`bg-gradient-to-br ${productColors[changelog.product]} bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={config.color === "emerald" ? "success" : config.color === "blue" ? "info" : config.color === "amber" ? "warning" : "destructive"}>
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                          <span className="text-sm text-zinc-500 font-mono">v{changelog.version}</span>
                          {changelog.is_featured && (
                            <Badge variant="secondary" className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-2xl mb-2">{changelog.title}</CardTitle>
                        <CardDescription className="text-base">{changelog.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-zinc-400 capitalize">
                          {changelog.product.replace('-', ' ')}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {new Date(changelog.release_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {changelog.items && changelog.items.length > 0 && (
                    <CardContent>
                      <div className="border-t border-zinc-800/50 pt-4">
                        <h4 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          Changes in this release
                        </h4>
                        <ul className="space-y-2">
                          {changelog.items.map((item) => (
                            <li key={item.id} className="flex items-start gap-3 text-sm">
                              <span className={`mt-0.5 font-mono ${
                                item.type === 'added' ? 'text-emerald-400' :
                                item.type === 'changed' ? 'text-blue-400' :
                                item.type === 'fixed' ? 'text-amber-400' :
                                item.type === 'removed' ? 'text-red-400' :
                                'text-orange-400'
                              }`}>
                                {typeIcons[item.type]}
                              </span>
                              <span className="text-zinc-300">{item.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {(!changelogs || changelogs.length === 0) && (
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Tag className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-400 mb-2">No changelogs yet</h3>
                  <p className="text-sm text-zinc-500">Check back soon for updates!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
