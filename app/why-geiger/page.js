import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SessionHeader } from "@/components/session-header";
import { SessionLink } from "@/components/session-link";
import Footer from "@/components/footer";
import { GridBackdrop } from "@/components/grid-backdrop";
import { displayFont } from "@/components/suite-landing/display_font";
import { AVAILABLE_APP_COUNT, SUITE_APP_BY_ID, SUITE_APPS } from "@/components/suite-landing/suite_catalog";
import { computeEstimate, plans } from "@/lib/pricing/plans";
import {
  AppChip,
  BodyNote,
  DISPLAY,
  EYEBROW,
  FAINT,
  PANEL,
  Pill,
  SectionHead,
  SpectrumHeader,
} from "@/components/why-geiger/why_geiger_kit";
import {
  ALTERNATIVES,
  ANSWERS,
  APP_DETAILS,
  AUDIENCES,
  GAINS,
  LOSSES,
  PRICES_CHECKED,
  REASONS,
  SANDBOX_APP_IDS,
  STACK_AXIS_MAX,
  STACK_SEATS,
  STACK_TOOLS,
  STATS,
  STEPS,
} from "@/components/why-geiger/why_geiger_content";

export const metadata = {
  title: "Why Geiger",
  description:
    "What each Geiger Studio app does, who it suits, and what it costs next to the tools your team pays for today.",
  alternates: { canonical: "/why-geiger" },
};

const money = (value) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

// Cheapest plan for the stack's apps, priced by the same function checkout charges with.
const STACK_APP_IDS = [...new Set(STACK_TOOLS.map((tool) => tool.app))];
const GEIGER = plans
  .map((plan) => computeEstimate({ planId: plan.id, selectedProducts: STACK_APP_IDS, metrics: { seats: STACK_SEATS } }))
  .reduce((best, estimate) => (best && best.total <= estimate.total ? best : estimate), null);
const STACK_TOTAL = STACK_TOOLS.reduce((sum, tool) => sum + tool.cost, 0);
const COMING_COUNT = SUITE_APPS.length - AVAILABLE_APP_COUNT;
const STACK_APP_NAMES = STACK_APP_IDS.map((id) => SUITE_APP_BY_ID[id].name).join(", ");

const PRIMARY_BUTTON =
  "inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const SECONDARY_BUTTON =
  "inline-flex h-10 items-center rounded-full border border-border-strong px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const TH = `px-4 py-3.5 text-left font-mono text-[11px] leading-none font-medium tracking-[0.12em] uppercase ${FAINT}`;
const TD = "border-t border-border px-4 py-3 align-top text-muted-foreground";

function Section({ children }) {
  return <section className="pt-16">{children}</section>;
}

function Header() {
  return (
    <header className="pb-2">
      <SpectrumHeader />
      <p className={`${EYEBROW} mt-10`}>Why Geiger</p>
      <h1
        className={`${DISPLAY} mt-[18px] max-w-[17ch] text-[2.3rem] leading-[1.02] tracking-[-0.035em] text-balance text-foreground [font-stretch:112%] sm:text-5xl lg:text-[4.2rem]`}
      >
        Why Teams Run Their Work on Geiger
      </h1>
      <p className="mt-[18px] max-w-[62ch] text-[1.08rem] leading-relaxed text-muted-foreground">
        Geiger Studio is one suite of apps for events, projects, canvases, forms, media and more, on one login and one
        bill. Here is what each app does, who it suits, and what it costs next to the tools you pay for now.
      </p>
      <div className={`mt-[22px] flex flex-wrap gap-x-[22px] gap-y-2 font-mono text-xs ${FAINT}`}>
        <span>Prices checked {PRICES_CHECKED}</span>
        <span>
          {AVAILABLE_APP_COUNT} apps available today, {COMING_COUNT} on the way
        </span>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <SessionLink label="Get Started" signedInLabel="Open Your Workspace" className={PRIMARY_BUTTON}>
          <ArrowRight className="h-4 w-4" />
        </SessionLink>
        <Link href="/pricing" className={SECONDARY_BUTTON}>
          See Pricing
        </Link>
      </div>
    </header>
  );
}

function Reasons() {
  return (
    <Section>
      <SectionHead eyebrow="In short" title="Six Reasons Teams Switch" />
      <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="min-w-0 bg-surface-subtle px-[22px] pt-[22px] pb-5">
            <div className="mb-3">
              <Pill>{reason.tag}</Pill>
            </div>
            <h3 className="mb-1.5 text-base leading-snug font-semibold text-foreground">{reason.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {reason.body === "bill"
                ? `Seven common tools cost a ${STACK_SEATS}-person team ${money(STACK_TOTAL)} a month. The same jobs on Geiger cost ${money(GEIGER.total)}.`
                : reason.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Suite() {
  return (
    <Section>
      <SectionHead eyebrow="01 · The suite" title={`${SUITE_APPS.length} Apps, Each Built for One Job`} />
      <div className={`${PANEL} overflow-x-auto`}>
        <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
          <thead>
            <tr>
              <th className={TH}>App</th>
              <th className={TH}>What it does</th>
              <th className={TH}>Highlights</th>
              <th className={TH}>Status</th>
              <th className={TH}>Try it</th>
            </tr>
          </thead>
          <tbody>
            {SUITE_APPS.map((app) => {
              const detail = APP_DETAILS[app.id];
              const hasSandbox = SANDBOX_APP_IDS.includes(app.id);
              return (
                <tr key={app.id}>
                  <td className={`${TD} font-semibold whitespace-nowrap text-foreground`}>
                    <span className="inline-flex items-center gap-2.5">
                      <AppChip app={app} />
                      {app.available ? (
                        <a href={app.href} className="underline-offset-4 hover:underline">
                          {app.name}
                        </a>
                      ) : (
                        app.name
                      )}
                    </span>
                  </td>
                  <td className={TD}>{detail.does}</td>
                  <td className={TD}>{detail.highlights}</td>
                  <td className={TD}>
                    <Pill tone={app.available ? "good" : "off"}>{app.available ? "Available" : "Coming Soon"}</Pill>
                  </td>
                  <td className={`${TD} font-mono text-[12.5px] whitespace-nowrap`}>
                    {hasSandbox ? (
                      <a
                        href={`${app.href}/playground`}
                        className="inline-flex items-center gap-1 text-foreground underline-offset-4 hover:underline"
                      >
                        Open Sandbox
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span aria-label="No sandbox">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <BodyNote>
        <strong>Start anywhere.</strong> Every app runs on the same account, so adding the next one doesn&apos;t mean a
        new login, a new invoice or a new interface to learn.
      </BodyNote>
    </Section>
  );
}

function Audiences() {
  return (
    <Section>
      <SectionHead eyebrow="02 · Who it's for" title="Start With One App, Then Add the Next" />
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((audience) => (
          <div key={audience.title} className={`${PANEL} flex min-w-0 flex-col p-5`}>
            <h3 className="mb-1.5 text-[15px] font-semibold text-foreground">{audience.title}</h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{audience.body}</p>
            {/* Pinned to the bottom so every card's app path lines up across the row. */}
            <ol className="mt-auto grid gap-1.5 font-mono text-xs">
              {audience.apps.map((id, index) => {
                const app = SUITE_APP_BY_ID[id];
                return (
                  <li key={id}>
                    <a
                      href={app.href}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-surface-card px-3 py-2 text-foreground transition-colors hover:border-border-strong"
                    >
                      <AppChip app={app} className="h-2.5 w-[5px]" />
                      <span className="flex-1">{app.name}</span>
                      <span className={FAINT}>{String(index + 1).padStart(2, "0")}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Bill() {
  const ticks = [0, 40, 80, 120];
  return (
    <Section>
      <SectionHead
        eyebrow="03 · The bill"
        title={`A ${STACK_SEATS}-Person Team's Stack Costs About ${money(Math.round(STACK_TOTAL))} a Month`}
      />
      <div className="grid gap-3.5 lg:grid-cols-[1.35fr_1fr]">
        <div
          role="img"
          aria-label={`Monthly cost per tool for a ${STACK_SEATS}-person team, from ${STACK_TOOLS[0].name} at ${money(STACK_TOOLS[0].cost)} down to ${STACK_TOOLS.at(-1).name} at ${money(STACK_TOOLS.at(-1).cost)}`}
          className={`${PANEL} min-w-0 p-[22px]`}
        >
          {STACK_TOOLS.map((tool) => (
            <div key={tool.name} className="grid grid-cols-[96px_1fr_58px] items-center gap-2 py-[5px] text-[13px] sm:grid-cols-[150px_1fr_70px] sm:gap-3">
              <div className="min-w-0 text-foreground">
                {tool.name}
                <small className={`block font-mono text-[11px] leading-snug ${FAINT}`}>{tool.plan}</small>
              </div>
              <div className="h-2.5 overflow-hidden rounded-[2px] border border-border bg-surface-card">
                <div className="h-full bg-foreground/80" style={{ width: `${(tool.cost / STACK_AXIS_MAX) * 100}%` }} />
              </div>
              <div className="text-right font-mono text-[12.5px] font-medium text-foreground tabular-nums">{money(tool.cost)}</div>
            </div>
          ))}
          <div className={`mt-2 grid grid-cols-[96px_1fr_58px] gap-2 font-mono text-[10.5px] ${FAINT} sm:grid-cols-[150px_1fr_70px] sm:gap-3`}>
            <span />
            <div className="flex justify-between">
              {ticks.map((tick) => (
                <span key={tick}>${tick}</span>
              ))}
            </div>
            <span />
          </div>
        </div>

        <div className={`${PANEL} flex min-w-0 flex-col gap-[18px] p-[22px]`}>
          {[
            { label: `${STACK_TOOLS.length} tools, monthly`, value: money(STACK_TOTAL) },
            { label: `Same jobs on Geiger ${GEIGER.selectedPlan.name}`, sub: STACK_APP_NAMES, value: money(GEIGER.total) },
          ].map((line, index, lines) => (
            <div
              key={line.label}
              className={`flex items-baseline justify-between gap-3 ${index < lines.length - 1 ? "border-b border-dashed border-border-strong pb-3.5" : ""}`}
            >
              <span className="text-[13.5px] text-muted-foreground">
                {line.label}
                {line.sub ? <span className={`block text-[12.5px] ${FAINT}`}>{line.sub}</span> : null}
              </span>
              <span className={`${DISPLAY} text-[2rem] leading-none tracking-[-0.02em] text-foreground tabular-nums [font-stretch:106%]`}>
                {line.value}
              </span>
            </div>
          ))}
          <div className="mt-auto flex flex-col gap-[18px]">
            <p className={`text-[12.5px] leading-relaxed ${FAINT}`}>
              Geiger {GEIGER.selectedPlan.name} is {money(GEIGER.selectedPlan.price)} a month with{" "}
              {GEIGER.selectedPlan.seatAllowance} collaborators included. This mix adds {money(GEIGER.productCost)} for extra
              apps and {money(GEIGER.seatCost)} for extra collaborators. Other prices are US list prices with annual billing
              where offered. Ticket fees are extra on every stack.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 self-start text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              Build Your Own Estimate
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Alternatives() {
  return (
    <Section>
      <SectionHead eyebrow="04 · Alternatives" title="How Geiger Compares With the Usual Options" />
      <div className={`${PANEL} overflow-x-auto`}>
        <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
          <thead>
            <tr>
              <th className={TH}>Option</th>
              <th className={TH}>What it covers</th>
              <th className={TH}>How it&apos;s priced</th>
              <th className={TH}>With Geiger</th>
            </tr>
          </thead>
          <tbody>
            {ALTERNATIVES.map((row) => (
              <tr key={row.option}>
                <td className={`${TD} font-semibold whitespace-nowrap text-foreground`}>{row.option}</td>
                <td className={TD}>{row.covers}</td>
                <td className={TD}>{row.priced}</td>
                <td className={`${TD} text-foreground`}>{row.geiger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3.5 grid gap-3.5 md:grid-cols-2">
        {[
          { title: "What You Get With Geiger", items: GAINS, mark: "bg-emerald-500" },
          { title: "What You Leave Behind", items: LOSSES, mark: "bg-red-500" },
        ].map((card) => (
          <div key={card.title} className={`${PANEL} min-w-0 px-[22px] py-5`}>
            <h3 className="mb-3 text-[15px] font-semibold text-foreground">{card.title}</h3>
            <ul className="grid gap-2.5">
              {card.items.map((item) => (
                <li key={item.strong} className="relative pl-[18px] text-sm text-muted-foreground">
                  <span aria-hidden="true" className={`absolute top-[0.62em] left-0 h-0.5 w-2 ${card.mark}`} />
                  <strong className="font-semibold text-foreground">{item.strong}</strong> {item.rest}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Numbers() {
  return (
    <Section>
      <SectionHead eyebrow="05 · The numbers" title="What Tool Sprawl Costs" />
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.body} className="min-w-0 border-t border-border-strong pt-3.5">
            <p className={`${DISPLAY} text-[1.6rem] leading-none tracking-[-0.02em] text-foreground [font-stretch:106%]`}>
              {stat.value}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{stat.body}</p>
            <a href={stat.url} target="_blank" rel="noreferrer" className={`font-mono text-[11px] ${FAINT} underline-offset-2 hover:underline`}>
              {stat.source}
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Answers() {
  return (
    <Section>
      <SectionHead eyebrow="06 · Straight answers" title="What People Ask Before They Switch" />
      <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border">
        {ANSWERS.map((item) => (
          <div key={item.question} className="grid items-start gap-2 bg-surface-subtle px-5 py-4 md:grid-cols-[120px_1fr] md:gap-[18px]">
            <span>
              <Pill tone={item.tone}>{item.pill}</Pill>
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">{item.question}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function GettingStarted() {
  return (
    <Section>
      <SectionHead eyebrow="07 · Getting started" title="From Sign-Up to Your Second App" />
      <ol className="grid">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="grid grid-cols-[36px_1fr] items-baseline gap-x-[18px] gap-y-1 border-b border-border py-4 md:grid-cols-[52px_220px_1fr]"
          >
            <span className={`font-mono text-xs font-medium ${FAINT}`}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={`${DISPLAY} text-[17px] leading-tight text-foreground [font-stretch:106%]`}>{step.title}</h3>
            <p className="col-start-2 text-sm text-muted-foreground md:col-start-3">
              {step.body}
              <span className={`mt-1.5 block font-mono text-xs leading-normal ${FAINT}`}>{step.note}</span>
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <SessionLink label="Get Started" signedInLabel="Open Your Workspace" className={PRIMARY_BUTTON}>
          <ArrowRight className="h-4 w-4" />
        </SessionLink>
        <Link href="/contact" className={SECONDARY_BUTTON}>
          Talk to Us
        </Link>
      </div>
    </Section>
  );
}

export default function WhyGeigerPage() {
  return (
    <div className={`${displayFont.variable} flex min-h-screen w-full flex-col overflow-x-clip bg-background font-sans text-foreground`}>
      <GridBackdrop variant="subtle" />
      <SessionHeader />

      <main className="relative z-10 px-4 pt-24 pb-20 sm:px-6 sm:pt-28">
        <div className="mx-auto w-full max-w-[1080px] text-[15px] leading-[1.65]">
          <Header />
          <Reasons />
          <Suite />
          <Audiences />
          <Bill />
          <Alternatives />
          <Numbers />
          <Answers />
          <GettingStarted />
        </div>
      </main>

      <Footer />
    </div>
  );
}
