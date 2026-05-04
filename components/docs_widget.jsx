import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Blocks,
  Briefcase,
  Cloud,
  Code2,
  Database,
  FileText,
  KeyRound,
  ListChecks,
  MonitorCog,
  Network,
  Package,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const quickLinks = [
  {
    icon: Rocket,
    title: "Get Started",
    description: "Install Geiger, onboard your workspace, and ship your first project in minutes.",
    href: "#get-started",
  },
  {
    icon: ListChecks,
    title: "Changelog",
    description: "Track product updates, release notes, and migration guidance for each release.",
    href: "/changelog",
  },
  {
    icon: Code2,
    title: "CLI",
    description: "Use Geiger from your terminal for scripting, automation, and CI workflows.",
    href: "#cli-reference",
  },
  {
    icon: Sparkles,
    title: "Concepts",
    description: "Understand projects, canvases, assets, automations, and team governance.",
    href: "#concepts",
  },
  {
    icon: Package,
    title: "Suite Products",
    description: "Explore Geiger Flow, Notes, DAM, Grey, and Dash with practical workflows.",
    href: "#products",
  },
  {
    icon: Briefcase,
    title: "Plans",
    description: "Compare Starter, Pro, Team, and Enterprise plans and included limits.",
    href: "#plans",
  },
  {
    icon: Network,
    title: "Integrations",
    description: "Connect external tools, ingest data, and set up approval and sync flows.",
    href: "#integrations",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description: "Review auth, permissions, audit controls, retention policies, and compliance.",
    href: "#security",
  },
];

const sidebarSections = [
  {
    title: "Get Started",
    links: [
      { label: "Welcome", href: "#welcome" },
      { label: "Quickstart", href: "#get-started" },
      { label: "Workspace Setup", href: "#workspace-setup" },
    ],
  },
  {
    title: "Core",
    links: [
      { label: "Concepts", href: "#concepts" },
      { label: "Suite Architecture", href: "#suite-architecture" },
      { label: "Products", href: "#products" },
    ],
  },
  {
    title: "Plans and Billing",
    links: [
      { label: "Plans", href: "#plans" },
      { label: "Usage and Limits", href: "#usage" },
      { label: "Billing FAQ", href: "#billing-faq" },
    ],
  },
  {
    title: "Build and Operate",
    links: [
      { label: "CLI", href: "#cli-reference" },
      { label: "Integrations", href: "#integrations" },
      { label: "Deployment", href: "#deployment" },
      { label: "Troubleshooting", href: "#troubleshooting" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "Security", href: "#security" },
      { label: "Governance", href: "#governance" },
      { label: "Support", href: "#support" },
    ],
  },
];

const planRows = [
  {
    feature: "Seats included",
    starter: "1",
    pro: "5",
    team: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    feature: "Active projects",
    starter: "5",
    pro: "Unlimited",
    team: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    feature: "Automation runs / month",
    starter: "100",
    pro: "5,000",
    team: "25,000",
    enterprise: "Custom",
  },
  {
    feature: "Asset storage",
    starter: "1 GB",
    pro: "100 GB",
    team: "1 TB",
    enterprise: "Custom",
  },
  {
    feature: "Version history",
    starter: "7 days",
    pro: "30 days",
    team: "90 days",
    enterprise: "Custom retention",
  },
  {
    feature: "SSO and SCIM",
    starter: "No",
    pro: "No",
    team: "SSO",
    enterprise: "SSO + SCIM",
  },
];

function PlaceholderImage({ label }) {
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardContent className="p-3">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/docs-placeholder.svg`}
          alt={`${label} placeholder`}
          width={1200}
          height={630}
          className="h-44 w-full rounded-lg border border-zinc-800 object-cover"
        />
        <p className="mt-2 text-xs text-zinc-500">{label} (replace with final product image)</p>
      </CardContent>
    </Card>
  );
}

export default function DocsWidget() {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-zinc-500/15 text-zinc-300 border-zinc-700">Documentation</Badge>
          <Badge variant="outline" className="border-zinc-700 text-zinc-400">
            Updated for Geiger Suite v1
          </Badge>
        </div>
        <h1 id="welcome" className="text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">
          Geiger Docs
        </h1>
        <p className="max-w-4xl text-zinc-400">
          Learn how to plan, create, collaborate, and ship with the full Geiger suite. This documentation mirrors the
          structure of modern product docs while staying native to Geiger workflows and UI.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.title} href={item.href}>
              <Card className="h-full border-zinc-800 bg-zinc-900/50 transition-colors hover:border-zinc-700">
                <CardHeader className="pb-3">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/60">
                    <Icon className="h-4 w-4 text-zinc-300" />
                  </div>
                  <CardTitle className="text-lg text-zinc-100">{item.title}</CardTitle>
                  <CardDescription className="text-zinc-400">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-6 border-zinc-800 bg-zinc-900/50 lg:hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-zinc-200">Browse Documentation</CardTitle>
          <CardDescription>Jump to any section quickly on mobile.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Accordion type="single" collapsible>
            {sidebarSections.map((section) => (
              <AccordionItem key={section.title} value={section.title}>
                <AccordionTrigger className="py-3 text-zinc-300">{section.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-md px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)_220px]">
        <aside className="hidden xl:block">
          <Card className="sticky top-24 border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">Navigation</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[66vh] pr-3">
                <div className="space-y-5">
                  {sidebarSections.map((section) => (
                    <div key={section.title}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">{section.title}</p>
                      <div className="space-y-1">
                        {section.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block rounded-md px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        <article className="space-y-8">
          <Card id="get-started" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Get Started</CardTitle>
              <CardDescription>Install Geiger, connect your workspace, and launch your first project.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-zinc-800 bg-zinc-950/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">1. Install and sign in</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-zinc-400">
                    Install Geiger Desktop and sign in with your workspace identity provider.
                  </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-950/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">2. Create your workspace</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-zinc-400">
                    Invite teammates, set environment defaults, and configure your project templates.
                  </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-950/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">3. Ship your first flow</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-zinc-400">
                    Use Geiger Flow to scope tasks, sync assets, and move work through approval stages.
                  </CardContent>
                </Card>
              </div>
              <PlaceholderImage label="Getting started overview" />
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                Helpful shortcuts:
                <Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>J</Kbd>
                opens workspace settings.
              </div>
            </CardContent>
          </Card>

          <Card id="workspace-setup" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Workspace Setup</CardTitle>
              <CardDescription>Recommended setup for teams onboarding to Geiger for the first time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-300">
              <p>Start with one workspace per organization and one project per product initiative.</p>
              <p>Assign roles early: workspace admins, project owners, editors, and reviewers.</p>
              <p>
                Connect your core systems first: identity provider, storage destination, and issue tracking source.
              </p>
            </CardContent>
          </Card>

          <Card id="concepts" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Core Concepts</CardTitle>
              <CardDescription>Understand the objects and workflows that power Geiger.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: Workflow,
                  title: "Projects",
                  text: "A project is the central unit where planning, notes, assets, approvals, and releases converge.",
                },
                {
                  icon: Blocks,
                  title: "Nodes",
                  text: "Nodes represent tasks, docs, media, comments, and automations connected across your lifecycle.",
                },
                {
                  icon: Database,
                  title: "Data Rooms",
                  text: "Data Rooms store structured artifacts and metrics used by planning, reporting, and audit workflows.",
                },
                {
                  icon: KeyRound,
                  title: "Permissions",
                  text: "Permissions control who can view, edit, approve, publish, and export across every module.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="border-zinc-800 bg-zinc-950/40">
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/60">
                        <Icon className="h-4 w-4 text-zinc-300" />
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-zinc-400">{item.text}</CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          <Card id="suite-architecture" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Suite Architecture</CardTitle>
              <CardDescription>How Geiger products interact in an end-to-end delivery flow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-5">
                {["Flow", "Notes", "DAM", "Grey", "Dash"].map((name) => (
                  <Card key={name} className="border-zinc-800 bg-zinc-950/40">
                    <CardContent className="p-4 text-center text-sm font-semibold text-zinc-200">Geiger {name}</CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-zinc-400">
                Typical sequence: scope work in Flow, create and iterate in Notes, store and govern media in DAM,
                automate and assist in Grey, then monitor progress and outcomes in Dash.
              </p>
            </CardContent>
          </Card>

          <Card id="products" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Products</CardTitle>
              <CardDescription>Detailed guidance for each product inside the Geiger suite.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="flow" className="w-full">
                <div className="mb-4 overflow-x-auto pb-1">
                  <TabsList className="min-w-max bg-zinc-800 text-zinc-400">
                    <TabsTrigger value="flow">Flow</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="dam">DAM</TabsTrigger>
                    <TabsTrigger value="grey">Grey</TabsTrigger>
                    <TabsTrigger value="dash">Dash</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="flow" className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Geiger Flow is your planning and execution layer for roadmaps, milestones, dependencies, and
                    delivery tracking.
                  </p>
                  <PlaceholderImage label="Geiger Flow board and timeline" />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Geiger Notes provides an infinite collaborative canvas for brainstorming, diagrams, and design
                    docs.
                  </p>
                  <PlaceholderImage label="Geiger Notes collaborative canvas" />
                </TabsContent>

                <TabsContent value="dam" className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Geiger DAM centralizes media ingestion, metadata enrichment, approvals, and distribution control.
                  </p>
                  <PlaceholderImage label="Geiger DAM asset library and metadata panel" />
                </TabsContent>

                <TabsContent value="grey" className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Geiger Grey delivers AI assistance for drafting, search, automation orchestration, and workflow
                    summarization.
                  </p>
                  <PlaceholderImage label="Geiger Grey assistant workspace" />
                </TabsContent>

                <TabsContent value="dash" className="space-y-4">
                  <p className="text-sm text-zinc-400">
                    Geiger Dash is the command surface for portfolio-level health, usage visibility, and governance
                    reporting.
                  </p>
                  <PlaceholderImage label="Geiger Dash operations and analytics view" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card id="plans" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Plans and Pricing</CardTitle>
              <CardDescription>Plan matrix for the full Geiger suite.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead>Starter</TableHead>
                    <TableHead>Pro</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Enterprise</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planRows.map((row) => (
                    <TableRow key={row.feature}>
                      <TableCell className="font-medium text-zinc-200">{row.feature}</TableCell>
                      <TableCell className="text-zinc-400">{row.starter}</TableCell>
                      <TableCell className="text-zinc-300">{row.pro}</TableCell>
                      <TableCell className="text-zinc-300">{row.team}</TableCell>
                      <TableCell className="text-zinc-300">{row.enterprise}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card id="usage" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Usage and Limits</CardTitle>
              <CardDescription>How usage is calculated across projects and products.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-400">
              <p>Usage rolls up by workspace and breaks down by product, team, and environment.</p>
              <p>Automation and AI actions meter separately from storage and active collaboration sessions.</p>
              <p>Daily and monthly summaries are available in Dash and exportable through CSV and API.</p>
            </CardContent>
          </Card>

          <Card id="cli-reference" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">CLI Reference</CardTitle>
              <CardDescription>Run Geiger workflows from local terminals and CI pipelines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="border-zinc-800 bg-zinc-950/40">
                <CardContent className="space-y-2 p-4 font-mono text-xs text-zinc-300">
                  <p>geiger login</p>
                  <p>geiger project create --name &quot;Q3 Launch&quot;</p>
                  <p>geiger flow import ./tasks.csv</p>
                  <p>geiger notes export --project q3-launch --format pdf</p>
                </CardContent>
              </Card>
              <p className="text-sm text-zinc-400">
                CLI supports non-interactive tokens, environment profiles, and deployment-safe dry runs.
              </p>
            </CardContent>
          </Card>

          <Card id="integrations" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Integrations</CardTitle>
              <CardDescription>Connect your existing stack and keep systems in sync.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                { icon: FileText, title: "Knowledge", text: "Confluence, Notion, and internal docs for contextual assistance." },
                { icon: Cloud, title: "Storage", text: "S3-compatible buckets and cloud object stores for approved assets." },
                { icon: MonitorCog, title: "Issue Tracking", text: "Jira and Linear sync for task status, assignees, and milestones." },
                { icon: Network, title: "Webhooks", text: "Custom outbound and inbound events for approvals, publishes, and audits." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="border-zinc-800 bg-zinc-950/40">
                    <CardHeader className="pb-2">
                      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/60">
                        <Icon className="h-4 w-4 text-zinc-300" />
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-zinc-400">{item.text}</CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          <Card id="deployment" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Deployment and Self Hosting</CardTitle>
              <CardDescription>Run Geiger in managed cloud or self-hosted environments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-400">
              <p>Managed cloud is recommended for fastest onboarding and automatic upgrades.</p>
              <p>Self-hosted mode supports private networking, dedicated storage, and custom retention policies.</p>
              <p>Enterprise deployments can add private routing and customer-managed keys.</p>
            </CardContent>
          </Card>

          <Card id="security" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Security and Compliance</CardTitle>
              <CardDescription>Baseline controls and hardening guidance for regulated teams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-400">
              <p>Role-based permissions across workspace, project, and item scopes.</p>
              <p>Optional SSO, audit logs, environment separation, and configurable retention windows.</p>
              <p>Compliance-ready controls for data residency, exports, and legal hold workflows.</p>
            </CardContent>
          </Card>

          <Card id="governance" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Governance Playbooks</CardTitle>
              <CardDescription>Extra operational docs for scale, controls, and review discipline.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-zinc-800 bg-zinc-950/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Review Gates</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-zinc-400">
                    Define mandatory approvals for legal, security, and brand before publish.
                  </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-950/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Lifecycle Labels</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-zinc-400">
                    Standardize statuses across planning, production, review, and archived work.
                  </CardContent>
                </Card>
                <Card className="border-zinc-800 bg-zinc-950/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Retention Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-zinc-400">
                    Apply product-specific retention defaults and exceptions by team or project type.
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card id="troubleshooting" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Troubleshooting</CardTitle>
              <CardDescription>Common issues and quick fixes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="sync">
                  <AccordionTrigger>Assets are not syncing to DAM destination</AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Check storage credentials, verify webhook delivery, and confirm destination policy allows write
                    operations from your Geiger workspace.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="roles">
                  <AccordionTrigger>Users cannot edit projects after invite</AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Ensure the user has a project role above viewer and confirm inherited workspace restrictions are not
                    overriding project-level access.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="automation">
                  <AccordionTrigger>Automation jobs are delayed</AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Review concurrency limits, queue volume in Dash, and retry policy configuration for the affected
                    environment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card id="billing-faq" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Billing FAQ</CardTitle>
              <CardDescription>Plan, invoicing, and subscription lifecycle answers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="upgrade">
                  <AccordionTrigger>Can we change plans mid-cycle?</AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Yes. Upgrades apply immediately and prorate automatically. Downgrades take effect on renewal.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="invoice">
                  <AccordionTrigger>Do you support annual invoicing?</AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Team and Enterprise plans support annual billing and consolidated invoicing with finance contacts.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="trial">
                  <AccordionTrigger>Is trial usage counted toward paid usage?</AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Trial quotas are isolated. Paid usage meters begin when your workspace starts a paid plan.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card id="support" className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-100">Support</CardTitle>
              <CardDescription>For account and billing help, contact the Geiger support team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200">Contact Support</Button>
                <Button variant="outline" className="border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800">
                  Open Community Forum
                </Button>
              </div>
              <Separator className="bg-zinc-800" />
              <p className="text-sm text-zinc-500">Was this page helpful? Yes / No</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-6">
              <div>
                <p className="text-sm text-zinc-400">Need release-by-release updates?</p>
                <p className="font-semibold text-zinc-200">Follow the changelog and roadmap updates.</p>
              </div>
              <Link href="/changelog">
                <Button className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
                  Open Changelog
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </article>

        <aside className="hidden 2xl:block">
          <Card className="sticky top-24 border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-wider text-zinc-400">On This Page</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ScrollArea className="h-[66vh] pr-2">
                <div className="space-y-2 text-sm">
                  {[
                    ["Get Started", "#get-started"],
                    ["Workspace Setup", "#workspace-setup"],
                    ["Concepts", "#concepts"],
                    ["Suite Architecture", "#suite-architecture"],
                    ["Products", "#products"],
                    ["Plans", "#plans"],
                    ["Usage and Limits", "#usage"],
                    ["CLI", "#cli-reference"],
                    ["Integrations", "#integrations"],
                    ["Deployment", "#deployment"],
                    ["Security", "#security"],
                    ["Governance", "#governance"],
                    ["Troubleshooting", "#troubleshooting"],
                    ["Billing FAQ", "#billing-faq"],
                    ["Support", "#support"],
                  ].map(([label, href]) => (
                    <Link
                      key={href}
                      href={href}
                      className="block rounded-md px-2 py-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
