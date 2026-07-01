// A buyer's ticket order for a Geiger Events event completed payment.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
} from "../../components/ui.jsx";

export default function TicketPurchaseConfirmation({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Events">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Event", value: data.eventName },
          { label: "Date", value: data.eventDate },
          { label: "Ticket", value: data.ticketType },
          { label: "Quantity", value: data.quantity },
          { label: "Total paid", value: data.orderTotal ? `$${data.orderTotal}` : undefined },
          { label: "Order", value: data.orderId ? `#${data.orderId}` : undefined },
        ]}
      />
      <EmailButton href={data.eventUrl}>{content.cta_label}</EmailButton>
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
