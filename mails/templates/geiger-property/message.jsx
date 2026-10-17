// A generic message from a property team: inbox replies, merged template
// sends, automation emails and team alerts. `data.subject` / `data.body` are
// already merged with the recipient's records; blank lines split paragraphs.
import { Fragment } from "react";
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton } from "../../components/ui.jsx";

const blocks = (body) =>
  String(body || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export default function Message({ content = {}, data = {} }) {
  return (
    <Layout preview={data.subject || content.heading} product="Geiger Property" footerNote={content.footer_note}>
      {data.subject ? <EmailHeading>{data.subject}</EmailHeading> : null}
      {blocks(data.body).map((p, i) => (
        <Paragraph key={i}>
          {p.split("\n").map((line, j, all) => (
            <Fragment key={j}>
              {line}
              {j < all.length - 1 ? <br /> : null}
            </Fragment>
          ))}
        </Paragraph>
      ))}
      {data.ctaUrl && content.cta_label ? <EmailButton href={data.ctaUrl}>{content.cta_label}</EmailButton> : null}
      {content.outro ? <Paragraph muted>{content.outro}</Paragraph> : null}
    </Layout>
  );
}
