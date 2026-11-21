// A resident's monthly statement: opening balance, charges, payments, closing balance and amount due, with a portal link.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";

export default function ResidentStatement({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Statement period", value: data.period },
          { label: "Opening balance", value: data.opening },
          { label: "Charges", value: data.charges },
          { label: "Payments & credits", value: data.payments },
          { label: "Closing balance", value: data.closing },
          { label: "Amount due", value: data.credit ? "" : data.amountDue },
          { label: "Due by", value: data.dueDate },
          { label: "Credit on account", value: data.credit },
          { label: "Property", value: data.propertyName },
          { label: "Unit", value: data.unitLabel },
        ]}
      />
      {data.portalUrl ? <EmailButton href={data.portalUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
