// The recipient was added to a project.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
} from "../../components/ui.jsx";

export default function ProjectAdded({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Project", value: data.projectName },
          { label: "Added by", value: data.addedBy },
          { label: "Role", value: data.role },
        ]}
      />
      <EmailButton href={data.projectUrl}>{content.cta_label}</EmailButton>
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
