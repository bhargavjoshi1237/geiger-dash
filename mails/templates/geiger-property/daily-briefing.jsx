// A team member's daily briefing from Geiger Property: what changed since the last one, the top signals for
// their role (each with why it matters and the money at stake) and open review items, with a link to the
// Briefing screen. `data.signals` = [{ title, why, impact, area, urgency }], `data.changes` = [{ kind, title }],
// `data.counts` = { open, new, worse, resolved, moneyAtStake, reviewOpen, reviewAssigned } (formatted).
import { Section } from "@react-email/components";
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";
import { theme } from "../../theme.js";

const font = theme.font.sans;

const URGENCY_COLOR = { urgent: "#dc2626", soon: "#d97706", routine: theme.color.muted };

function SignalList({ signals = [] }) {
  if (!signals.length) return null;
  return (
    <Section style={{ margin: "0 0 24px" }}>
      {signals.map((s, i) => (
        <div key={i} style={{ padding: "12px 0", borderBottom: `1px solid ${theme.color.border}` }}>
          <p style={{ fontFamily: font, fontSize: "14px", lineHeight: "20px", fontWeight: 600, color: theme.color.heading, margin: 0 }}>
            {i + 1}. {s.title}
            {s.impact ? <span style={{ fontWeight: 400, color: theme.color.muted }}> · {s.impact}</span> : null}
          </p>
          <p style={{ fontFamily: font, fontSize: "13px", lineHeight: "19px", color: theme.color.text, margin: "4px 0 0" }}>{s.why}</p>
          <p style={{ fontFamily: font, fontSize: "11px", lineHeight: "16px", color: URGENCY_COLOR[s.urgency] || theme.color.muted, margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {[s.area, s.urgency].filter(Boolean).join(" · ")}
          </p>
        </div>
      ))}
    </Section>
  );
}

function Changes({ changes = [] }) {
  if (!changes.length) return null;
  return (
    <Section style={{ margin: "0 0 24px" }}>
      <p style={{ fontFamily: font, fontSize: "13px", fontWeight: 600, color: theme.color.heading, margin: "0 0 6px" }}>Since your last briefing</p>
      {changes.map((c, i) => (
        <p key={i} style={{ fontFamily: font, fontSize: "13px", lineHeight: "19px", color: theme.color.text, margin: "2px 0" }}>
          <span style={{ color: theme.color.muted }}>{c.kind}:</span> {c.title}
        </p>
      ))}
    </Section>
  );
}

export default function DailyBriefing({ content = {}, data = {} }) {
  const counts = data.counts || {};
  return (
    <Layout preview={data.headline || content.intro} product="Geiger Property">
      <EmailHeading>{data.headline || content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Your areas", value: data.areas },
          { label: "Open signals", value: [counts.open, counts.moneyAtStake ? `${counts.moneyAtStake} at stake` : ""].filter(Boolean).join(" · ") },
          { label: "Changes", value: `${counts.new ?? 0} new · ${counts.worse ?? 0} worse · ${counts.resolved ?? 0} resolved` },
          { label: "Review queue", value: `${counts.reviewOpen ?? 0} open${counts.reviewAssigned ? ` · ${counts.reviewAssigned} assigned to you` : ""}` },
        ]}
      />
      <SignalList signals={Array.isArray(data.signals) ? data.signals : []} />
      <Changes changes={Array.isArray(data.changes) ? data.changes : []} />
      {data.briefingUrl ? <EmailButton href={data.briefingUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
