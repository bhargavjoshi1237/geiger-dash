// A resident's lease is approaching its end date.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";

export default function LeaseExpiring({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Lease ends", value: data.leaseEnd },
          { label: "Days left", value: data.daysLeft },
          { label: "Current rent", value: data.rent },
          { label: "Property", value: data.propertyName },
          { label: "Unit", value: data.unitLabel },
        ]}
      />
      {data.ctaUrl ? <EmailButton href={data.ctaUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
