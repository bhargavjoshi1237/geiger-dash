// A broadcast announcement from a property team. The body arrives already
// merged per recipient in `data.body`; blank lines split paragraphs.
import { Fragment } from "react";
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton } from "../../components/ui.jsx";

const blocks = (body) =>
  String(body || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

export default function Announcement({ content = {}, data = {} }) {
  return (
    <Layout preview={data.subject || content.heading} product="Geiger Property" footerNote={content.footer_note}>
      <EmailHeading>{data.subject || content.heading}</EmailHeading>
      {content.intro ? <Paragraph muted>{content.intro}</Paragraph> : null}
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
      {data.ctaUrl ? <EmailButton href={data.ctaUrl}>{content.cta_label}</EmailButton> : null}
    </Layout>
  );
}
