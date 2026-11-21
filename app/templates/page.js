import { ResourceIndex } from "@/components/resources/resource-page";
import { FORM_TEMPLATES } from "@/lib/resources/form-templates";

export const metadata = {
  title: "Free Event Form Templates",
  description:
    "Free form templates for event organizers and organisers: event registration with dietary and access questions, workshop sign-up, volunteers, speakers, vendors and post-event feedback.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "Free Event Form Templates | Geiger Studios",
    description: "Copy-ready registration, volunteer, speaker, vendor and feedback forms for events.",
    url: "/templates",
    type: "website",
  },
};

export default function TemplatesPage() {
  return (
    <ResourceIndex
      title="Free form templates for events"
      description="Copy the questions, or build any of these in Geiger Forms with the same field types and show-when logic. Every template lists exactly what to ask and why."
      items={FORM_TEMPLATES.map((template) => ({ href: `/templates/${template.slug}`, label: template.name, description: template.useFor }))}
    />
  );
}
