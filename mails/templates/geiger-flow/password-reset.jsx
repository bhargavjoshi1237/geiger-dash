// Password reset request.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton } from "../../components/ui.jsx";

export default function PasswordReset({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <EmailButton href={data.resetUrl}>{content.cta_label}</EmailButton>
      <Paragraph muted>{content.expiry_note}</Paragraph>
      <Paragraph muted>{content.ignore_note}</Paragraph>
    </Layout>
  );
}
