import { notFound } from "next/navigation";
import { GitBranch, Layers, ListChecks } from "lucide-react";
import { ResourcePage, ResourceSection, Showcase, backdropFor } from "@/components/resources/resource-page";
import { FormTemplatePreview } from "@/components/resources/form-template-preview";
import { FORM_TEMPLATES, TEMPLATES_SECTION, findTemplate } from "@/lib/resources/form-templates";

export const dynamicParams = false;

export function generateStaticParams() {
  return FORM_TEMPLATES.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const template = findTemplate(slug);
  if (!template) return {};
  const path = `/templates/${template.slug}`;
  return {
    title: { absolute: template.metaTitle },
    description: template.description,
    alternates: { canonical: path },
    openGraph: { title: template.metaTitle, description: template.description, url: path, type: "article" },
    twitter: { card: "summary", title: template.metaTitle, description: template.description },
  };
}

export default async function FormTemplatePage({ params }) {
  const { slug } = await params;
  const template = findTemplate(slug);
  if (!template) notFound();

  const path = `/templates/${template.slug}`;
  const questions = template.fields.filter((field) => !field.section);
  const required = questions.filter((field) => field.required).length;
  const conditional = questions.filter((field) => field.logic).length;
  const related = [
    ...template.related.map((postSlug) => ({ href: `/blog/${postSlug}`, kind: "Blog", label: postTitle(postSlug), description: "From the Geiger blog" })),
    ...FORM_TEMPLATES.filter((other) => other.slug !== template.slug).map((other) => ({ href: `/templates/${other.slug}`, kind: "Form template", label: `${other.name} template`, description: other.useFor })),
  ].slice(0, 6);

  return (
    <ResourcePage
      section={TEMPLATES_SECTION}
      path={path}
      kind="Form template"
      title={template.title}
      description={template.description}
      meta={[
        { icon: ListChecks, label: `${questions.length} questions, ${required} required` },
        conditional ? { icon: GitBranch, label: `${conditional} shown only when they apply` } : null,
        { icon: Layers, label: "Built from Geiger Forms field types" },
      ].filter(Boolean)}
      showcase={
        <Showcase backdrop={backdropFor(path)} label={`${template.name} · Geiger Forms`}>
          <FormTemplatePreview template={template} />
        </Showcase>
      }
      faqs={template.faqs}
      related={related}
      relatedTitle="Related templates and guides"
      cta={{
        title: "Build this form in Geiger Forms",
        body: "Recreate it in minutes with the same field types and show-when logic, then share a link or embed it. Or ask the same questions at checkout in Geiger Events, which takes no platform fee on tickets; the only per-ticket fee is Stripe's card processing fee.",
        href: "/forms",
        label: "See Geiger Forms",
      }}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: template.title,
          description: template.description,
          step: template.tips.map((tip, index) => ({ "@type": "HowToStep", position: index + 1, name: tip.title, text: tip.body })),
        },
      ]}
    >
      <ResourceSection title="Use it for">
        <p className="max-w-3xl text-lg leading-8 tracking-tight text-foreground/85">{template.useFor}</p>
      </ResourceSection>

      <ResourceSection title="Why these questions work" note={String(template.tips.length).padStart(2, "0")}>
        <div className="grid overflow-hidden rounded-xl border-l border-t border-border sm:grid-cols-2">
          {template.tips.map((tip, index) => (
            <div key={tip.title} className="border-b border-r border-border bg-background p-6">
              <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{tip.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{tip.body}</p>
            </div>
          ))}
        </div>
      </ResourceSection>
    </ResourcePage>
  );
}

// Readable label from a blog slug, so related links don't need a database read on a static page.
function postTitle(slug) {
  const text = slug.replaceAll("-", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
