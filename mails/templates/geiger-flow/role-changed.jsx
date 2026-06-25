// A member's organization role changed.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  DataPanel,
} from "../../components/ui.jsx";

export default function RoleChanged({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Organization", value: data.orgName },
          { label: "Previous role", value: data.oldRole },
          { label: "New role", value: data.newRole },
          { label: "Changed by", value: data.changedBy },
        ]}
      />
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
