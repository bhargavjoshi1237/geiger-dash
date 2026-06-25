// An issue was assigned to the recipient.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
} from "../../components/ui.jsx";

export default function IssueAssigned({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Issue", value: data.issueTitle },
          { label: "Project", value: data.projectName },
          { label: "Priority", value: data.priority },
          { label: "Due", value: data.dueDate },
          { label: "Assigned by", value: data.assignerName },
        ]}
      />
      <EmailButton href={data.issueUrl}>{content.cta_label}</EmailButton>
    </Layout>
  );
}
