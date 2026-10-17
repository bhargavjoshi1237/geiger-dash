// A scheduled report from Geiger Property: the report's headline figures plus a
// preview of its main table, with a link to open the full report in the app.
// `data.summary` = [{ label, value, footer }], `data.tableColumns` = [header],
// `data.tableRows` = [[cell]] (already formatted strings).
import { Section } from "@react-email/components";
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";
import { theme } from "../../theme.js";

const font = theme.font.sans;
const isNumeric = (v) => /^[-($]*[\d,]+(\.\d+)?[%d)]?$/.test(String(v || "").trim());

const cell = (align, head) => ({
  fontFamily: font,
  fontSize: "12px",
  lineHeight: "16px",
  color: head ? theme.color.muted : theme.color.text,
  fontWeight: head ? 600 : 400,
  textAlign: align,
  padding: "6px 8px",
  borderBottom: `1px solid ${theme.color.border}`,
  whiteSpace: "nowrap",
});

function PreviewTable({ title, columns = [], rows = [], more = 0 }) {
  if (!columns.length || !rows.length) return null;
  const align = columns.map((_, i) => (i > 0 && rows.some((r) => isNumeric(r[i])) ? "right" : "left"));
  return (
    <Section style={{ margin: "0 0 24px" }}>
      {title ? (
        <p style={{ fontFamily: font, fontSize: "13px", fontWeight: 600, color: theme.color.heading, margin: "0 0 8px" }}>{title}</p>
      ) : null}
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{ borderCollapse: "collapse", border: `1px solid ${theme.color.border}`, borderRadius: "8px" }}
      >
        <thead>
          <tr style={{ backgroundColor: theme.color.panel }}>
            {columns.map((c, i) => (
              <th key={i} style={cell(align[i], true)}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {columns.map((_, i) => (
                <td key={i} style={cell(align[i], false)}>
                  {r[i] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {more > 0 ? (
        <p style={{ fontFamily: font, fontSize: "12px", color: theme.color.muted, margin: "8px 0 0" }}>
          + {more} more row{more === 1 ? "" : "s"} in the full report.
        </p>
      ) : null}
    </Section>
  );
}

export default function ScheduledReport({ content = {}, data = {} }) {
  const summary = Array.isArray(data.summary) ? data.summary : [];
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Report", value: data.reportTitle },
          { label: "Period", value: data.period },
          { label: "For", value: data.subtitle },
          ...summary.map((s) => ({ label: s.label, value: [s.value, s.footer].filter(Boolean).join(" · ") })),
        ]}
      />
      <PreviewTable
        title={data.tableTitle}
        columns={Array.isArray(data.tableColumns) ? data.tableColumns : []}
        rows={Array.isArray(data.tableRows) ? data.tableRows : []}
        more={Number(data.moreRows) || 0}
      />
      {data.reportUrl ? <EmailButton href={data.reportUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
