// The monthly owner statement: income, expenses, fees and distribution.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";

export default function OwnerStatement({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Period", value: data.period },
          { label: "Property", value: data.propertyName },
          { label: "Income", value: data.income },
          { label: "Expenses", value: data.expenses },
          { label: "Management fees", value: data.managementFees },
          { label: "Distribution", value: data.distribution },
        ]}
      />
      {data.statementUrl ? <EmailButton href={data.statementUrl}>{content.cta_label}</EmailButton> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
