// New comment / mention on an issue.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  Quote,
} from "../../components/ui.jsx";

export default function IssueComment({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <Quote>{data.comment}</Quote>
      <EmailButton href={data.issueUrl}>{content.cta_label}</EmailButton>
    </Layout>
  );
}
