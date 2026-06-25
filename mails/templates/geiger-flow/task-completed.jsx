// A task was marked complete.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
} from "../../components/ui.jsx";

export default function TaskCompleted({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Task", value: data.taskTitle },
          { label: "Project", value: data.projectName },
          { label: "Completed by", value: data.completedBy },
        ]}
      />
      <EmailButton href={data.taskUrl}>{content.cta_label}</EmailButton>
    </Layout>
  );
}
