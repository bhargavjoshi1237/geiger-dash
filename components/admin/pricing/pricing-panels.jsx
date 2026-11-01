"use client";

import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@geiger/ui";
import { NumberField, PanelCard, SwitchField, TextField } from "@/components/admin/pricing/pricing-fields";

const LIMITS = [
  ["projectAllowance", "Active projects"],
  ["seatAllowance", "Collaborators"],
  ["storageAllowance", "Storage (GB)"],
  ["aiAllowance", "AI credits"],
  ["emailAllowance", "Monthly emails"],
];
const INCLUDED_APPS = [
  ["core", "Main apps"],
  ["addon", "Tools"],
  ["cherry", "Cherry apps"],
  ["security", "Security"],
  ["domains", "Domains"],
  ["email", "Email"],
];
const RATES = [
  ["project", "Extra project", "/mo"],
  ["collaborator", "Extra person", "/mo"],
  ["storage", "Storage", "/GB"],
  ["bandwidth", "Transfer", "/GB"],
  ["edgeData", "Edge delivery", "/GB"],
  ["aiPer1000", "AI credits", "/1,000"],
  ["emailPer1000", "Emails", "/1,000"],
];
const STEPS = [
  ["storage", "Storage", "GB"],
  ["aiCredits", "AI credits", "credits"],
  ["emails", "Emails", "emails"],
  ["edgeData", "Edge delivery", "GB"],
];

function PlanLimits({ plan, update, disabled }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {LIMITS.map(([key, label]) => (
        <NumberField
          key={key}
          id={`${plan.id}-${key}`}
          label={label}
          step="1"
          value={plan[key]}
          disabled={disabled}
          onChange={(value) => update({ [key]: value })}
        />
      ))}
    </div>
  );
}

function FeatureList({ plan, update, disabled }) {
  return (
    <TextField
      id={`${plan.id}-included`}
      label="Feature list (one per line)"
      multiline
      rows={6}
      value={(plan.included || []).join("\n")}
      disabled={disabled}
      onChange={(value) => update({ included: value.split("\n") })}
    />
  );
}

export function PlansPanel({ draft, patch, canEdit }) {
  const updatePlan = (id, changes) =>
    patch((config) => ({ ...config, plans: config.plans.map((plan) => (plan.id === id ? { ...plan, ...changes } : plan)) }));
  const updateBeta = (changes) => patch((config) => ({ ...config, betaPlan: { ...config.betaPlan, ...changes } }));
  const disabled = !canEdit;

  return (
    <div className="space-y-4">
      {draft.plans.map((plan) => (
        <PanelCard key={plan.id} title={plan.name || plan.id} description={`Plan id "${plan.id}". Ordered lowest to highest tier.`}>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
              <TextField id={`${plan.id}-name`} label="Name" value={plan.name} disabled={disabled} onChange={(name) => updatePlan(plan.id, { name })} />
              <NumberField id={`${plan.id}-price`} label="Price per month" prefix="$" value={plan.price} disabled={disabled} onChange={(price) => updatePlan(plan.id, { price })} />
            </div>
            <TextField id={`${plan.id}-tagline`} label="Tagline" value={plan.tagline} disabled={disabled} onChange={(tagline) => updatePlan(plan.id, { tagline })} />
            <TextField id={`${plan.id}-description`} label="Description" multiline value={plan.description} disabled={disabled} onChange={(description) => updatePlan(plan.id, { description })} />
            <div>
              <p className="mb-2 text-xs font-semibold text-foreground">Included limits</p>
              <PlanLimits plan={plan} disabled={disabled} update={(changes) => updatePlan(plan.id, changes)} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-foreground">Included apps</p>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {INCLUDED_APPS.map(([key, label]) => (
                  <NumberField
                    key={key}
                    id={`${plan.id}-apps-${key}`}
                    label={label}
                    step="1"
                    value={plan.productAllowances[key]}
                    disabled={disabled}
                    onChange={(value) => updatePlan(plan.id, { productAllowances: { ...plan.productAllowances, [key]: value } })}
                  />
                ))}
              </div>
            </div>
            <FeatureList plan={plan} disabled={disabled} update={(changes) => updatePlan(plan.id, changes)} />
            <SwitchField label='Show "Most popular"' checked={plan.featured} disabled={disabled} onChange={(featured) => updatePlan(plan.id, { featured })} />
          </div>
        </PanelCard>
      ))}

      <PanelCard title={draft.betaPlan.name || "Alpha tester"} description="The free plan. It always costs $0 and includes every app, so its price and apps can't be changed here.">
        <div className="space-y-4">
          <TextField id="beta-name" label="Name" value={draft.betaPlan.name} disabled={disabled} onChange={(name) => updateBeta({ name })} />
          <TextField id="beta-description" label="Description" multiline value={draft.betaPlan.description} disabled={disabled} onChange={(description) => updateBeta({ description })} />
          <PlanLimits plan={draft.betaPlan} disabled={disabled} update={updateBeta} />
          <FeatureList plan={draft.betaPlan} disabled={disabled} update={updateBeta} />
        </div>
      </PanelCard>
    </div>
  );
}

export function AppsPanel({ draft, patch, canEdit }) {
  const updateProduct = (id, changes) =>
    patch((config) => ({ ...config, products: config.products.map((product) => (product.id === id ? { ...product, ...changes } : product)) }));
  const updateCategory = (id, changes) =>
    patch((config) => ({ ...config, productCategories: config.productCategories.map((category) => (category.id === id ? { ...category, ...changes } : category)) }));
  const disabled = !canEdit;

  return (
    <div className="space-y-4">
      {draft.productCategories.map((category) => (
        <PanelCard key={category.id} title={category.name}>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
              <TextField id={`category-${category.id}-description`} label="Description" value={category.description} disabled={disabled} onChange={(description) => updateCategory(category.id, { description })} />
              <NumberField id={`category-${category.id}-rate`} label="Price per extra, per month" prefix="$" value={category.rate} disabled={disabled} onChange={(rate) => updateCategory(category.id, { rate })} />
            </div>
            <ul className="divide-y divide-border rounded-lg border border-border">
              {draft.products
                .filter((product) => product.category === category.id)
                .map((product) => (
                  <li key={product.id} className="grid gap-3 p-3 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)_110px_150px] md:items-end">
                    <p className="text-sm font-medium text-foreground md:pb-1.5">{product.name}</p>
                    <TextField id={`${product.id}-blurb`} label="Short description" value={product.blurb} disabled={disabled} onChange={(blurb) => updateProduct(product.id, { blurb })} />
                    <TextField id={`${product.id}-detail`} label="Detail" value={product.detail} disabled={disabled} onChange={(detail) => updateProduct(product.id, { detail })} />
                    {product.price !== undefined ? (
                      <NumberField id={`${product.id}-price`} label="Own price" prefix="$" value={product.price} disabled={disabled} onChange={(price) => updateProduct(product.id, { price })} />
                    ) : (
                      <p className="text-xs text-muted-foreground md:pb-2">Category price</p>
                    )}
                    <SwitchField label="Coming soon" checked={product.comingSoon} disabled={disabled} onChange={(comingSoon) => updateProduct(product.id, { comingSoon })} />
                  </li>
                ))}
            </ul>
          </div>
        </PanelCard>
      ))}
    </div>
  );
}

export function UsagePanel({ draft, patch, canEdit }) {
  const disabled = !canEdit;
  const updateRate = (key, value) => patch((config) => ({ ...config, usageRates: { ...config.usageRates, [key]: value } }));
  const updateStep = (id, index, value) =>
    patch((config) => ({
      ...config,
      usageSteps: { ...config.usageSteps, [id]: config.usageSteps[id].map((step, position) => (position === index ? value : step)) },
    }));

  return (
    <div className="space-y-4">
      <PanelCard title="Usage rates" description="What anything past a plan's included limits costs.">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {RATES.map(([key, label, suffix]) => (
            <NumberField key={key} id={`rate-${key}`} label={label} prefix="$" suffix={suffix} value={draft.usageRates[key]} disabled={disabled} onChange={(value) => updateRate(key, value)} />
          ))}
        </div>
      </PanelCard>

      <PanelCard title="Usage presets" description="How much Medium and Heavy add on top of the plan. Light always adds nothing.">
        <div className="grid gap-4 sm:grid-cols-2">
          {STEPS.map(([id, label, unit]) => (
            <div key={id}>
              <p className="mb-2 text-xs font-semibold text-foreground">{label}</p>
              <div className="grid grid-cols-2 gap-3">
                <NumberField id={`step-${id}-medium`} label="Medium" step="1" suffix={unit} value={draft.usageSteps[id][0]} disabled={disabled} onChange={(value) => updateStep(id, 0, value)} />
                <NumberField id={`step-${id}-heavy`} label="Heavy" step="1" suffix={unit} value={draft.usageSteps[id][1]} disabled={disabled} onChange={(value) => updateStep(id, 1, value)} />
              </div>
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard title="Billing and trial">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField
            id="yearly-multiplier"
            label="Months charged for a year"
            value={draft.yearlyMultiplier}
            disabled={disabled}
            onChange={(yearlyMultiplier) => patch((config) => ({ ...config, yearlyMultiplier }))}
          />
          <NumberField
            id="trial-days"
            label="Free trial length"
            step="1"
            suffix="days"
            value={draft.trialDays}
            disabled={disabled}
            onChange={(trialDays) => patch((config) => ({ ...config, trialDays }))}
          />
        </div>
      </PanelCard>
    </div>
  );
}

export function PagePanel({ draft, patch, canEdit }) {
  const disabled = !canEdit;
  const { page } = draft;
  const updatePage = (changes) => patch((config) => ({ ...config, page: { ...config.page, ...changes } }));
  const updateFaqs = (faqs) => updatePage({ faqs });
  const field = (key) => ({ id: `page-${key}`, value: page[key], disabled, onChange: (value) => updatePage({ [key]: value }) });
  const moveFaq = (index, by) => {
    const faqs = [...page.faqs];
    const [faq] = faqs.splice(index, 1);
    faqs.splice(index + by, 0, faq);
    updateFaqs(faqs);
  };

  return (
    <div className="space-y-4">
      <PanelCard title="Sections" description="Hiding the trial or Alpha tester offer also stops anyone starting one.">
        <div className="grid gap-3 sm:grid-cols-2">
          <SwitchField label="Free trial offer" checked={page.showTrial} disabled={disabled} onChange={(showTrial) => updatePage({ showTrial })} />
          <SwitchField label="Alpha tester strip" checked={page.showBeta} disabled={disabled} onChange={(showBeta) => updatePage({ showBeta })} />
          <SwitchField label="FAQ" checked={page.showFaq} disabled={disabled} onChange={(showFaq) => updatePage({ showFaq })} />
          <SwitchField label="Contact block" checked={page.showContact} disabled={disabled} onChange={(showContact) => updatePage({ showContact })} />
        </div>
      </PanelCard>

      <PanelCard title="Hero">
        <div className="space-y-3">
          <TextField label="Title" {...field("heroTitle")} />
          <TextField label="Description" multiline {...field("heroDescription")} />
        </div>
      </PanelCard>

      <PanelCard title="Plans section">
        <div className="space-y-3">
          <TextField label="Label" {...field("plansEyebrow")} />
          <TextField label="Heading" {...field("plansHeading")} />
          <TextField label="Description" multiline {...field("plansDescription")} />
        </div>
      </PanelCard>

      <PanelCard title="FAQ" description="Answers are plain text, so update any prices they mention when you change them.">
        <div className="space-y-3">
          <TextField label="Heading" {...field("faqHeading")} />
          {page.faqs.map((faq, index) => (
            <div key={index} className="space-y-3 rounded-lg border border-border p-3">
              <TextField
                id={`faq-${index}-question`}
                label={`Question ${index + 1}`}
                value={faq.question}
                disabled={disabled}
                onChange={(question) => updateFaqs(page.faqs.map((item, position) => (position === index ? { ...item, question } : item)))}
              />
              <TextField
                id={`faq-${index}-answer`}
                label="Answer"
                multiline
                rows={3}
                value={faq.answer}
                disabled={disabled}
                onChange={(answer) => updateFaqs(page.faqs.map((item, position) => (position === index ? { ...item, answer } : item)))}
              />
              {canEdit ? (
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => moveFaq(index, -1)}>
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" aria-label={`Move question ${index + 1} down`} disabled={index === page.faqs.length - 1} onClick={() => moveFaq(index, 1)}>
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove question ${index + 1}`}
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => updateFaqs(page.faqs.filter((_, position) => position !== index))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : null}
            </div>
          ))}
          {canEdit ? (
            <Button variant="outline" size="sm" onClick={() => updateFaqs([...page.faqs, { question: "", answer: "" }])}>
              <Plus className="h-3.5 w-3.5" />
              Add question
            </Button>
          ) : null}
        </div>
      </PanelCard>

      <PanelCard title="Contact block">
        <div className="space-y-3">
          <TextField label="Title" {...field("contactTitle")} />
          <TextField label="Description" {...field("contactDescription")} />
          <TextField label="Email" {...field("contactEmail")} />
        </div>
      </PanelCard>
    </div>
  );
}

const formatWhen = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function HistoryPanel({ versions, versionId, defaults, canEdit, busy, onRestore }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-card">
      <ul>
        {versions.map((version) => (
          <li key={version.id} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0">
            <div className="min-w-0">
              <p className="text-sm text-foreground" suppressHydrationWarning>
                {formatWhen(version.createdAt)}
                {version.id === versionId ? <span className="ml-2 text-xs font-medium text-muted-foreground">Live</span> : null}
              </p>
              <p className="truncate text-xs text-muted-foreground">{[version.author, version.note].filter(Boolean).join(" · ") || "No note"}</p>
            </div>
            {canEdit && version.id !== versionId ? (
              <Button variant="outline" size="sm" disabled={busy} onClick={() => onRestore(version.config)}>
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
                Review restore
              </Button>
            ) : null}
          </li>
        ))}
        <li className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm text-foreground">
              Original prices
              {versionId === null ? <span className="ml-2 text-xs font-medium text-muted-foreground">Live</span> : null}
            </p>
            <p className="text-xs text-muted-foreground">The values built into the code, used before anything was published.</p>
          </div>
          {canEdit && versionId !== null ? (
            <Button variant="outline" size="sm" disabled={busy} onClick={() => onRestore(defaults)}>
              <RotateCcw className="h-3.5 w-3.5" />
              Review restore
            </Button>
          ) : null}
        </li>
      </ul>
    </div>
  );
}
