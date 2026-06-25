// Passwordless magic-link sign-in (with a fallback code).
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  CodeBlock,
} from "../../components/ui.jsx";

export default function MagicLink({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <EmailButton href={data.magicUrl}>{content.cta_label}</EmailButton>
      {data.code ? (
        <>
          <Paragraph muted>{content.code_note}</Paragraph>
          <CodeBlock>{data.code}</CodeBlock>
        </>
      ) : null}
    </Layout>
  );
}
