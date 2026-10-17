// A rent payment was received and applied to a resident's ledger.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";

export default function RentReceipt({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Amount paid", value: data.amount },
          { label: "Paid on", value: data.paidOn },
          { label: "Method", value: data.method },
          { label: "Reference", value: data.reference },
          { label: "Remaining balance", value: data.balance },
          { label: "Property", value: data.propertyName },
          { label: "Unit", value: data.unitLabel },
        ]}
      />
      {data.ctaUrl ? <EmailButton href={data.ctaUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
