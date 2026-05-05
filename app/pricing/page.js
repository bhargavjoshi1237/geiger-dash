import Link from "next/link";
import { ArrowRight, Check, X, Zap, Crown, Diamond, HelpCircle, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/footer";
import { PlanCards } from "@/components/pricing/plan_cards";

const featureCategories = [
  {
    name: "Canvas & Projects",
    features: [
      { name: "Canvas Projects", starter: "5 included", pro: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
      { name: "Team Members", starter: "1 user", pro: "5 users", team: "Unlimited", enterprise: "Unlimited" },
      { name: "Project Storage", starter: "1 GB", pro: "10 GB", team: "100 GB", enterprise: "Unlimited" },
      { name: "File Uploads", starter: "10 MB max", pro: "100 MB max", team: "500 MB max", enterprise: "Unlimited" },
      { name: "Custom Domains", starter: false, pro: true, team: true, enterprise: true },
      { name: "API Access", starter: false, pro: true, team: true, enterprise: true },
    ]
  },
  {
    name: "Geiger Flow",
    features: [
      { name: "Kanban Boards", starter: "3 boards", pro: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
      { name: "Timeline View", starter: false, pro: true, team: true, enterprise: true },
      { name: "Node Discussions", starter: true, pro: true, team: true, enterprise: true },
      { name: "Project Templates", starter: "Basic", pro: "Advanced", team: "Advanced", enterprise: "Custom" },
      { name: "Workflow Automation", starter: false, pro: "100/month", team: "1,000/month", enterprise: "Unlimited" },
      { name: "Time Tracking", starter: false, pro: true, team: true, enterprise: true },
    ]
  },
  {
    name: "Geiger Notes",
    features: [
      { name: "Infinite Canvas", starter: true, pro: true, team: true, enterprise: true },
      { name: "Real-time Collaboration", starter: "2 users", pro: "10 users", team: "50 users", enterprise: "Unlimited" },
      { name: "Node Types", starter: "Basic", pro: "Advanced", team: "Advanced", enterprise: "Custom" },
      { name: "Export Formats", starter: "PDF", pro: "PDF, PNG, SVG", team: "All formats", enterprise: "All + API" },
      { name: "Version History", starter: "7 days", pro: "30 days", team: "90 days", enterprise: "Unlimited" },
      { name: "Comment Reactions", starter: true, pro: true, team: true, enterprise: true },
    ]
  },
  {
    name: "Database & Storage",
    features: [
      { name: "Database Size", starter: "500 MB", pro: "8 GB", team: "100 GB", enterprise: "Unlimited" },
      { name: "Automatic Backups", starter: false, pro: "7 days", team: "14 days", enterprise: "Custom retention" },
      { name: "Point-in-Time Recovery", starter: false, pro: false, team: true, enterprise: true },
      { name: "File Storage (DAM)", starter: "1 GB", pro: "100 GB", team: "1 TB", enterprise: "Unlimited" },
      { name: "CDN Bandwidth", starter: "5 GB", pro: "250 GB", team: "1 TB", enterprise: "Unlimited" },
      { name: "Asset Metadata", starter: "Basic", pro: "Advanced", team: "Advanced", enterprise: "Custom" },
    ]
  },
  {
    name: "Security & Compliance",
    features: [
      { name: "SOC2 Compliance", starter: false, pro: false, team: true, enterprise: true },
      { name: "SSO (SAML)", starter: false, pro: false, team: true, enterprise: true },
      { name: "HIPAA Compliance", starter: false, pro: false, team: false, enterprise: "Available" },
      { name: "Role-Based Access", starter: "Basic", pro: "Advanced", team: "Advanced", enterprise: "Custom RBAC" },
      { name: "Audit Logs", starter: "1 day", pro: "7 days", team: "28 days", enterprise: "Custom retention" },
      { name: "Private Link", starter: false, pro: false, team: false, enterprise: true },
    ]
  },
  {
    name: "Support",
    features: [
      { name: "Community Support", starter: true, pro: true, team: true, enterprise: true },
      { name: "Email Support", starter: false, pro: true, team: "Priority", enterprise: "24/7 Dedicated" },
      { name: "SLA Uptime", starter: false, pro: false, team: "99.5%", enterprise: "99.99%" },
      { name: "Dedicated Manager", starter: false, pro: false, team: false, enterprise: true },
      { name: "Private Slack Channel", starter: false, pro: false, team: false, enterprise: true },
      { name: "Onboarding Support", starter: false, pro: false, team: true, enterprise: "Custom" },
    ]
  }
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences."
  },
  {
    question: "Is there a free trial?",
    answer: "Our Pro and Enterprise plans come with a 14-day free trial. No credit card required to start."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Absolutely. You can cancel anytime from your dashboard. Your access continues until the end of your billing period."
  }
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ctaHref = user ? `/notes/${user.id}/home` : "/login";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#161616] text-[#e7e7e7] font-sans">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <Header />

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-20 pb-16 px-4 sm:px-6">
        <div className="w-full lg:w-[75%] mx-auto">
          {/* Page Header */}
          <div className="text-center mb-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-b from-[#e7e7e7] to-[#a3a3a3] bg-clip-text text-transparent">
             Pricing
            </h1>
            {/* <p className="text-base text-[#a3a3a3] max-w-2xl mx-auto leading-relaxed">
              Start building for free, collaborate with your team, then scale to millions of users
            </p> */}
          </div>

          <PlanCards ctaHref={ctaHref} />

          {/* Compare Plans Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-[#e7e7e7] flex items-center gap-3">
              Compare Plans
              <Badge variant="outline" className="text-xs border-[#333333] text-[#737373]">
                Feature Matrix
              </Badge>
            </h2>
            
            {/* Comparison Tables */}
            <div className="space-y-8">
              {featureCategories.map((category, catIndex) => (
                <div key={catIndex} className="bg-gradient-to-br from-[#1a1a1a] to-[#1e1e1e] border border-[#333333] rounded-2xl overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-[#202020] border-b border-[#333333] px-6 py-4">
                    <h3 className="text-lg font-bold text-[#e7e7e7]">{category.name}</h3>
                  </div>
                  
                  {/* Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#333333]">
                          <th className="text-left py-3 px-6 text-sm font-semibold text-[#a3a3a3]">Feature</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-[#a3a3a3] min-w-[120px]">Starter</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-zinc-400 min-w-[120px]">Pro</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-[#a3a3a3] min-w-[120px]">Team</th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-[#a3a3a3] min-w-[120px]">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {category.features.map((feature, featIndex) => (
                          <tr 
                            key={featIndex} 
                            className={`border-b border-[#2a2a2a] hover:bg-[#1e1e1e] transition-colors ${
                              featIndex === category.features.length - 1 ? 'border-b-0' : ''
                            }`}
                          >
                            <td className="py-3 px-6 text-sm text-[#e7e7e7]">{feature.name}</td>
                            <td className="text-center py-3 px-4">
                              {typeof feature.starter === 'boolean' ? (
                                feature.starter ? (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2a2a2a]">
                                    <X className="w-3 h-3 text-[#737373]" />
                                  </div>
                                )
                              ) : (
                                <span className="text-xs text-[#a3a3a3]">{feature.starter}</span>
                              )}
                            </td>
                            <td className="text-center py-3 px-4 bg-zinc-500/5">
                              {typeof feature.pro === 'boolean' ? (
                                feature.pro ? (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2a2a2a]">
                                    <X className="w-3 h-3 text-[#737373]" />
                                  </div>
                                )
                              ) : (
                                <span className="text-xs text-zinc-300 font-semibold">{feature.pro}</span>
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {typeof feature.team === 'boolean' ? (
                                feature.team ? (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2a2a2a]">
                                    <X className="w-3 h-3 text-[#737373]" />
                                  </div>
                                )
                              ) : (
                                <span className="text-xs text-[#a3a3a3]">{feature.team}</span>
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {typeof feature.enterprise === 'boolean' ? (
                                feature.enterprise ? (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2a2a2a]">
                                    <X className="w-3 h-3 text-[#737373]" />
                                  </div>
                                )
                              ) : (
                                <span className="text-xs text-[#a3a3a3]">{feature.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2a2a2a] hover:bg-[#333333] text-[#e7e7e7] rounded-xl text-sm font-semibold transition-all border border-[#333333] hover:border-[#474747]"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
