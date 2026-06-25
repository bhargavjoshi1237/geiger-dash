// An issue's status changed.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
} from "../../components/ui.jsx";

export default function IssueStatusChanged({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Issue", value: data.issueTitle },
          { label: "Project", value: data.projectName },
          { label: "From", value: data.oldStatus },
          { label: "To", value: data.newStatus },
          { label: "Changed by", value: data.changedBy },
        ]}
      />
      <EmailButton href={data.issueUrl}>{content.cta_label}</EmailButton>
    </Layout>
  );
}
