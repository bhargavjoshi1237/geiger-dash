// Internal notice: someone asked to join the beta from the pricing page.
import { Layout } from "../../components/Layout.jsx";
import {
  EmailHeading,
  Paragraph,
  EmailButton,
  DataPanel,
  Quote,
} from "../../components/ui.jsx";

export default function BetaRequest({ content = {}, data = {} }) {
  return (
    <Layout preview={content.intro} product="Geiger Studio">
      <EmailHeading>{content.heading}</EmailHeading>
      <Paragraph>{content.intro}</Paragraph>
      <DataPanel
        rows={[
          { label: "Name", value: data.name },
          { label: "Email", value: data.email },
          { label: "Company", value: data.company },
          { label: "Team size", value: data.teamSize },
          { label: "Apps", value: data.apps },
          { label: "Account", value: data.account },
          { label: "Submitted", value: data.submittedAt },
        ]}
      />
      {data.useCase ? <Quote>{data.useCase}</Quote> : null}
      <EmailButton href={`mailto:${data.email}`}>{content.cta_label}</EmailButton>
    </Layout>
  );
}
