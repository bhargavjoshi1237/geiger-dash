import { GitBranch } from "lucide-react";
import { FIELD_ICON } from "@/components/product-pages/apps/forms/forms_kit";

const CHOICE_TYPES = new Set(["Single choice", "Multiple choice", "Dropdown", "Ranking"]);

// Read-only render of a template's questions, grouped by section, with each field's Geiger Forms type and any show-when logic.
export function FormTemplatePreview({ template }) {
  // Question numbers skip section headings.
  const numbers = template.fields.reduce((list, field) => [...list, field.section ? null : list.filter(Boolean).length + 1], []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="px-5 pb-4 pt-2 sm:px-7">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Form preview</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{template.name}</h2>
      </div>
      <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {template.fields.map((field, index) => {
          if (field.section) {
            return (
              <li key={`section-${field.section}`} className="bg-surface-subtle/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:px-7">
                {field.section}
              </li>
            );
          }
          const Icon = FIELD_ICON[field.type];
          return (
            <li key={field.label} className="px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-foreground">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">{String(numbers[index]).padStart(2, "0")}</span>
                  {field.label}
                  {field.required ? <span className="ml-1 text-muted-foreground" aria-label="required">*</span> : null}
                </p>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">
                  {Icon ? <Icon className="size-3" /> : null}
                  {field.type}
                </span>
              </div>
              {CHOICE_TYPES.has(field.type) && field.options ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {field.options.map((option) => (
                    <span key={option} className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground">{option}</span>
                  ))}
                </div>
              ) : null}
              {field.type === "Matrix / Likert" && field.options ? (
                <p className="mt-3 text-xs text-muted-foreground">Rows: {field.options.join(", ")} · rated Poor to Excellent</p>
              ) : null}
              {field.note ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{field.note}</p> : null}
              {field.logic ? (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <GitBranch className="size-3" /> {field.logic}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
