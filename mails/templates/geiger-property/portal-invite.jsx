// An invitation to the resident, owner, or vendor portal.
import { Layout } from "../../components/Layout.jsx";
import { EmailHeading, Paragraph, EmailButton, DataPanel } from "../../components/ui.jsx";

export default function PortalInvite({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Property">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Portal", value: data.portalName },
          { label: "Property", value: data.propertyName },
          { label: "Invited by", value: data.inviterName },
        ]}
      />
      <EmailButton href={data.inviteUrl}>{content.cta_label}</EmailButton>
      <Paragraph muted>{content.outro}</Paragraph>
    </Layout>
  );
}
