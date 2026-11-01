// Internal notice: someone sent the sales or support form on /contact.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
  Quote,
} from "../../components/ui.jsx";

export default function ContactRequest({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Studio">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Name", value: data.name },
          { label: "Email", value: data.email },
          { label: "Company size", value: data.teamSize },
          { label: "Account", value: data.account },
          { label: "Attachments", value: data.attachments },
          { label: "Submitted", value: data.submittedAt },
        ]}
      />
      {data.message ? <Quote>{data.message}</Quote> : null}
      <EmailButton href={`mailto:${data.email}`}>{content.cta_label}</EmailButton>
    </Layout>
  );
}
