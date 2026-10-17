// A lease renewal offer with the proposed rent and term.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";

export default function RenewalOffer({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Current rent", value: data.currentRent },
          { label: "Offered rent", value: data.offeredRent },
          { label: "Term", value: data.termMonths ? `${data.termMonths} months` : "" },
          { label: "New term starts", value: data.newStart },
          { label: "Respond by", value: data.respondBy },
          { label: "Property", value: data.propertyName },
          { label: "Unit", value: data.unitLabel },
        ]}
      />
      {data.ctaUrl ? <EmailButton href={data.ctaUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
