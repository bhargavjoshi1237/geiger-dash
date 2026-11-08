// A resident's move-out statement: the security deposit accounting (held, move-out charges, applied, refund or balance owed) with the itemized charges.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, DataPanel } from "../../components/ui.jsx";

export default function MoveOutStatement({ content = {}, data = {} }) {
  const items = Array.isArray(data.items) ? data.items : [];
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      {data.revised ? <Paragraph muted>{content.revised_note}</Paragraph> : null}
      <DataPanel
        rows={[
          { label: "Home", value: data.premises },
          { label: "Moved out", value: data.moveOutDate },
          { label: "Deposit held", value: data.depositHeld },
          { label: "Move-out charges", value: data.charges },
          { label: "Deposit applied", value: data.applied },
          { label: "Refund due to you", value: data.refund },
          { label: "Refund by", value: data.refundMethod },
          { label: "Balance owed", value: data.balanceOwed },
        ]}
      />
      {items.length ? <DataPanel rows={items.map((i) => ({ label: i.label, value: i.amount }))} /> : null}
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
