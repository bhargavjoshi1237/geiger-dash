import { notFound } from "next/navigation";
import { ResourcePage } from "@/components/resources/resource-page";
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
  const questionCount = template.fields.filter((field) => !field.section).length;
  const related = [
    ...template.related.map((postSlug) => ({ href: `/blog/${postSlug}`, label: postTitle(postSlug), description: "From the Geiger blog" })),
    ...FORM_TEMPLATES.filter((other) => other.slug !== template.slug).slice(0, 5 - Math.min(template.related.length, 2)).map((other) => ({ href: `/templates/${other.slug}`, label: `${other.name} template`, description: other.useFor })),
  ].slice(0, 6);

  return (
    <ResourcePage
      section={TEMPLATES_SECTION}
      path={path}
      title={template.title}
      description={template.description}
      highlights={[`${questionCount} questions`, ...template.highlights]}
      faqs={template.faqs}
      related={related}
      cta={{
        title: "Build this form in Geiger Forms",
        body: "Recreate it in minutes with the same field types and show-when logic, then share a link or embed it. Sell tickets with the same questions in Geiger Events, with no Geiger fee per ticket.",
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
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mx-auto mb-6 max-w-3xl text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">Use it for:</span> {template.useFor} {questionCount} questions, required ones marked with *.
        </p>
        <FormTemplatePreview template={template} />
      </section>

      <section className="border-y border-border bg-surface-subtle/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-[-0.035em]">Why these questions work</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {template.tips.map((tip) => (
              <div key={tip.title} className="bg-background p-6">
                <h3 className="text-base font-medium">{tip.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ResourcePage>
  );
}

// Readable label from a blog slug, so related links don't need a database read on a static page.
function postTitle(slug) {
  const text = slug.replaceAll("-", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
