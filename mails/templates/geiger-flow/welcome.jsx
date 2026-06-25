// Account welcome / email confirmation.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton } from "../../components/ui.jsx";

export default function Welcome({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <EmailButton href={data.confirmUrl}>{content.cta_label}</EmailButton>
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
