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
  const items = FORM_TEMPLATES.map((template) => {
    const questions = template.fields.filter((field) => !field.section);
    return {
      href: `/templates/${template.slug}`,
      label: `${template.name} template`,
      badge: "Form template",
      meta: `${questions.length} questions · ${template.highlights.join(" · ")}`,
      description: template.description,
      previewTitle: template.name,
      preview: questions.slice(0, 4).map((field) => ({ label: field.label, value: field.type })),
    };
  });

  return (
    <ResourceIndex
      title="Form templates for events"
      description="Copy the questions, or build any of these in Geiger Forms with the same field types and show-when logic. Every template lists exactly what to ask and why."
      listTitle="All templates"
      items={items}
    />
  );
}
