// A task is due soon.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
} from "../../components/ui.jsx";

export default function TaskDueReminder({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Task", value: data.taskTitle },
          { label: "Project", value: data.projectName },
          { label: "Due", value: data.dueDate },
        ]}
      />
      <EmailButton href={data.taskUrl}>{content.cta_label}</EmailButton>
    </Layout>
  );
}
