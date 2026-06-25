// Organization / team invitation.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
} from "../../components/ui.jsx";

export default function OrgInvite({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Flow">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Organization", value: data.orgName },
          { label: "Invited by", value: data.inviterName },
          { label: "Role", value: data.role },
        ]}
      />
      <EmailButton href={data.acceptUrl}>{content.cta_label}</EmailButton>
      <Paragraph muted>{content.role_note}</Paragraph>
    </Layout>
  );
}
