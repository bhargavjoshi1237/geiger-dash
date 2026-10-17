// A compliance document (COI, license, renters insurance, W-9, agreement…) is
// expiring, has expired, or is missing. `data.message` overrides the intro for
// the missing-document cases.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";

export default function DocumentExpiring({ content = {}, data = {} }) {
  const intro = data.message || (data.expired ? content.expired_intro : content.intro);
  return (
    <Layout preview={intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Document", value: data.documentName },
          { label: "Type", value: data.documentType },
          { label: data.expired ? "Expired" : "Expires", value: data.expiresOn },
          { label: "Days left", value: data.expired ? "" : data.daysLeft },
        ]}
      />
      {data.ctaUrl ? <EmailButton href={data.ctaUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
