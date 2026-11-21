import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ResourcePage } from "@/components/resources/resource-page";
import { describePlan, formatMoney, ticketBreakdown } from "@/lib/resources/fee-math";
import { COMPARE_SECTION, COMPARISONS, comparisonSlug, findComparison } from "@/lib/resources/comparisons";
import { FEES_CHECKED, GEIGER, calculatorHref, defaultPlan, findFeePlatform } from "@/lib/resources/ticket-fees";

export const dynamicParams = false;

const PROFILE_ROWS = [
  ["bestFor", "Best for"],
  ["discovery", "Discovery marketplace"],
  ["reservedSeating", "Reserved seating"],
  ["recurring", "Recurring events"],
  ["questions", "Custom registration questions"],
  ["checkIn", "Check-in"],
  ["embed", "Embed on your site"],
  ["messaging", "Messaging guests"],
  ["payouts", "Payouts"],
  ["limits", "Watch out for"],
];

const GEIGER_PROFILE = {
  bestFor: "Organisers who sell their own tickets and want forms, planning and check-in on one account",
  discovery: "No, you bring your own audience",
  reservedSeating: "Yes, a seat-map editor with holds while buyers pay",
  recurring: "Time slots with their own capacity",
  questions: "Yes, including dietary and accessibility needs",
  checkIn: "Yes, QR scanning, door sales and a self check-in kiosk",
  embed: "Event pages and websites you publish",
  messaging: "Ticket emails and a buyer portal with tickets, calendar files and receipts",
  payouts: "Your own Stripe account, on Stripe's schedule",
  limits: "No discovery marketplace; a monthly plan from $29",
};

function resolve(slug) {
  const comparison = findComparison(slug);
  if (!comparison) return null;
  const a = findFeePlatform(comparison.a);
  const b = findFeePlatform(comparison.b);
  return a && b ? { comparison, a, b } : null;
}

export function generateStaticParams() {
  return COMPARISONS.map((comparison) => ({ pair: comparisonSlug(comparison) }));
}

function copyFor(a, b) {
  const title = `${a.name} vs ${b.name}`;
  const metaTitle = `${a.name} vs ${b.name} (2026): Fees, Payouts & Features Compared`;
  const sampleA = ticketBreakdown(defaultPlan(a), 25, defaultPlan(a).defaultPass);
  const sampleB = ticketBreakdown(defaultPlan(b), 25, defaultPlan(b).defaultPass);
  const description = `${a.name} vs ${b.name} for event organizers: on a $25 ticket ${a.name} buyers pay ${formatMoney(sampleA.buyerPays)} and you keep ${formatMoney(sampleA.organiserGets)}; on ${b.name} buyers pay ${formatMoney(sampleB.buyerPays)} and you keep ${formatMoney(sampleB.organiserGets)}. Fees, payouts and features side by side.`;
  return { title, metaTitle, description };
}

export async function generateMetadata({ params }) {
  const { pair } = await params;
  const resolved = resolve(pair);
  if (!resolved) return {};
  const { metaTitle, description } = copyFor(resolved.a, resolved.b);
  const path = `/compare/${pair}`;
  return {
    title: { absolute: metaTitle },
    description,
    alternates: { canonical: path },
    openGraph: { title: metaTitle, description, url: path, type: "article" },
    twitter: { card: "summary", title: metaTitle, description },
  };
}

export default async function ComparisonPage({ params }) {
  const { pair } = await params;
  const resolved = resolve(pair);
  if (!resolved) notFound();

  const { comparison, a, b } = resolved;
  const { title, description } = copyFor(a, b);
  const path = `/compare/${pair}`;
  const prices = [10, 25, 50, 100];
  const columns = [
    { name: a.name, plan: defaultPlan(a), pass: defaultPlan(a).defaultPass },
    { name: b.name, plan: defaultPlan(b), pass: defaultPlan(b).defaultPass },
    { name: GEIGER.name, plan: GEIGER.plan, pass: false, isGeiger: true },
  ];

  const faqs = [
    { question: `Which is cheaper, ${a.name} or ${b.name}?`, answer: `On ${defaultPlan(a).label}: ${describePlan(defaultPlan(a))}. On ${defaultPlan(b).label}: ${describePlan(defaultPlan(b))}. On a $25 ticket you keep ${formatMoney(ticketBreakdown(defaultPlan(a), 25, defaultPlan(a).defaultPass).organiserGets)} on ${a.name} and ${formatMoney(ticketBreakdown(defaultPlan(b), 25, defaultPlan(b).defaultPass).organiserGets)} on ${b.name}, using each platform's default for who pays.` },
    { question: `Who pays the fees on ${a.name} and ${b.name}?`, answer: `${a.name}: ${a.whoPays} ${b.name}: ${b.whoPays}` },
    { question: `How fast do ${a.name} and ${b.name} pay out?`, answer: `${a.name}: ${a.payouts} ${b.name}: ${b.payouts}` },
    { question: `Is there an alternative to ${a.name} and ${b.name} with no ticket fee?`, answer: `Geiger Events adds no fee per ticket. Sales are charged on your own Stripe account, so you pay only Stripe's processing fee (2.9% + 30¢ for a standard US card) plus a Geiger plan from $${GEIGER.monthly} a month. It has no discovery marketplace, so it suits organisers who bring their own audience.` },
  ];

  const others = COMPARISONS.filter((entry) => comparisonSlug(entry) !== pair).map((entry) => ({ href: `/compare/${comparisonSlug(entry)}`, label: `${findFeePlatform(entry.a)?.name} vs ${findFeePlatform(entry.b)?.name}`, description: "Fees, payouts and features side by side." }));
  const related = [
    { href: calculatorHref(a), label: `${a.name} fee calculator`, description: `Work out ${a.name} fees for your own ticket price.` },
    { href: calculatorHref(b), label: `${b.name} fee calculator`, description: `Work out ${b.name} fees for your own ticket price.` },
    ...[a, b].filter((platform) => platform.alternativeHref).map((platform) => ({ href: platform.alternativeHref, label: `${platform.name} alternative`, description: `How Geiger Events compares with ${platform.name}.` })),
    ...others,
  ].slice(0, 9);

  return (
    <ResourcePage
      section={COMPARE_SECTION}
      path={path}
      title={title}
      description={description}
      highlights={["Fees on real ticket prices", "Payouts and refunds", "Features side by side"]}
      checked={FEES_CHECKED}
      faqs={faqs}
      related={related}
      relatedTitle="Fee calculators and more comparisons"
      cta={{ title: `A third option: no fee per ticket`, body: GEIGER.summary, href: GEIGER.href, label: "See Geiger Events ticketing" }}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${title}: fees, payouts and features compared`,
          description,
          url: `https://geiger.studio${path}`,
          dateModified: "2026-11-21",
          publisher: { "@type": "Organization", name: "Geiger Studios", url: "https://geiger.studio" },
        },
      ]}
    >
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [a, comparison.chooseA],
            [b, comparison.chooseB],
          ].map(([platform, reason]) => (
            <div key={platform.id} className="rounded-xl border border-border bg-background p-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Choose {platform.name} if</p>
              <p className="mt-3 text-sm leading-6 text-foreground">{reason}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-[-0.035em]">Fees on common ticket prices</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Each platform&apos;s default for who pays: buyer pays / you keep. Standard US card rates, taxes excluded.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Ticket price</th>
                {columns.map((column) => <th key={column.name} className="px-4 py-3 text-right font-medium">{column.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{formatMoney(price)}</td>
                  {columns.map((column) => {
                    const ticket = ticketBreakdown(column.plan, price, column.pass);
                    return (
                      <td key={column.name} className={`px-4 py-3 text-right tabular-nums ${column.isGeiger ? "bg-surface-subtle" : ""}`}>
                        <span className="text-muted-foreground">{formatMoney(ticket.buyerPays)}</span> / <span className="font-medium">{formatMoney(ticket.organiserGets)}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 text-xs text-muted-foreground">Fee model</td>
                {columns.map((column) => (
                  <td key={column.name} className={`px-4 py-3 text-right text-xs text-muted-foreground ${column.isGeiger ? "bg-surface-subtle" : ""}`}>
                    {describePlan(column.plan)}{column.plan.estimate ? " (estimate)" : ""}{column.isGeiger ? `; plan from $${GEIGER.monthly}/month` : ""}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-y border-border bg-surface-subtle/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-[-0.035em]">Features side by side</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-background">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="w-44 px-4 py-3 font-medium" />
                  <th className="px-4 py-3 font-medium">{a.name}</th>
                  <th className="px-4 py-3 font-medium">{b.name}</th>
                  <th className="px-4 py-3 font-medium">{GEIGER.name}</th>
                </tr>
              </thead>
              <tbody>
                {PROFILE_ROWS.map(([key, label]) => (
                  <tr key={key} className="border-b border-border align-top last:border-0">
                    <th scope="row" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{label}</th>
                    <td className="px-4 py-3 leading-6">{a.profile[key]}</td>
                    <td className="px-4 py-3 leading-6">{b.profile[key]}</td>
                    <td className="bg-surface-subtle px-4 py-3 leading-6">{GEIGER_PROFILE[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[a, b].map((platform) => (
              <div key={platform.id}>
                <h3 className="text-base font-medium">{platform.name} refunds</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{platform.refunds}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {platform.sources.slice(0, 2).map((source) => (
                    <li key={source.url}>
                      <Link href={source.url} rel="nofollow noopener" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
                        {source.label} <ExternalLink className="size-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ResourcePage>
  );
}
