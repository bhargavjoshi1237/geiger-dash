// A work order changed status (scheduled, in progress, completed…).
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel, Quote } from "../../components/ui.jsx";

export default function WorkOrderUpdate({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Work order", value: data.workOrderTitle },
          { label: "Status", value: data.status },
          { label: "Scheduled", value: data.scheduledDate },
          { label: "Vendor", value: data.vendorName },
          { label: "Property", value: data.propertyName },
          { label: "Unit", value: data.unitLabel },
        ]}
      />
      {data.note ? <Quote>{data.note}</Quote> : null}
      {data.ctaUrl ? <EmailButton href={data.ctaUrl}>{content.cta_label}</EmailButton> : null}
    </Layout>
  );
}
