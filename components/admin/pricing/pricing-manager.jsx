"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, SegmentedTabs, Textarea } from "@geiger/ui";
import { useSectionParam } from "@/components/console/use-section-param";
import { AppsPanel, HistoryPanel, PagePanel, PlansPanel, UsagePanel } from "@/components/admin/pricing/pricing-panels";
import { diffPricingConfig, normalizePricingConfig, validatePricingConfig } from "@/lib/pricing/config";
import { DEFAULT_PRICING } from "@/lib/pricing/plans";
import { publishPricingAction } from "@/lib/pricing/actions";

const SECTIONS = [
  { value: "plans", label: "Plans" },
  { value: "apps", label: "Apps & add-ons" },
  { value: "usage", label: "Usage & billing" },
  { value: "page", label: "Page content" },
  { value: "history", label: "History" },
];
const SECTION_IDS = SECTIONS.map((section) => section.value);
const CHANGE_GROUPS = [
  { kind: "price", title: "Prices" },
  { kind: "limit", title: "Limits" },
  { kind: "copy", title: "Page content" },
];

// The draft keeps raw input strings, so compare and publish its normalized form.
const safeDiff = (live, draft) => diffPricingConfig(live, normalizePricingConfig(draft));

// Admin for everything /pricing shows: edits stay in a local draft until the review dialog publishes them as a new version.
export function PricingManager({ config, versionId, versions, canEdit }) {
  const router = useRouter();
  const [section, setSection] = useSectionParam(SECTION_IDS, "plans");
  const [draft, setDraft] = useState(config);
  const [reviewing, setReviewing] = useState(false);
  const [note, setNote] = useState("");
  const [publishing, setPublishing] = useState(false);

  const changes = useMemo(() => safeDiff(config, draft), [config, draft]);
  const errors = useMemo(() => validatePricingConfig(draft), [draft]);
  const has = (kind) => changes.some((change) => change.kind === kind);

  function restore(version) {
    setDraft(version);
    setReviewing(true);
  }

  async function publish() {
    setPublishing(true);
    const result = await publishPricingAction({ config: draft, note, baseVersionId: versionId }).catch(() => null);
    setPublishing(false);

    if (result?.ok) {
      toast.success("Pricing published");
      setReviewing(false);
      setNote("");
      router.refresh();
      return;
    }
    toast.error(result?.error || "Couldn't publish pricing.");
    if (result?.conflict) router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-6 lg:px-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Pricing</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Plans, prices, limits and everything else on the pricing page. New buyers get what you publish; existing customers keep the prices and limits they bought.
          </p>
          {canEdit ? null : <p className="mt-2 text-sm text-muted-foreground">Only content editors can change pricing.</p>}
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <a href="/pricing" target="_blank" rel="noreferrer">
            View live page
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </header>

      <SegmentedTabs tabs={SECTIONS} value={section} onChange={setSection} className="mb-4" buttonClassName="text-xs" />

      {section === "plans" ? <PlansPanel draft={draft} patch={setDraft} canEdit={canEdit} /> : null}
      {section === "apps" ? <AppsPanel draft={draft} patch={setDraft} canEdit={canEdit} /> : null}
      {section === "usage" ? <UsagePanel draft={draft} patch={setDraft} canEdit={canEdit} /> : null}
      {section === "page" ? <PagePanel draft={draft} patch={setDraft} canEdit={canEdit} /> : null}
      {section === "history" ? (
        <HistoryPanel versions={versions} versionId={versionId} defaults={DEFAULT_PRICING} canEdit={canEdit} busy={publishing} onRestore={restore} />
      ) : null}

      {canEdit && (changes.length > 0 || errors.length > 0) ? (
        <div className="sticky bottom-0 z-10 mt-4 flex flex-col gap-2 rounded-xl border border-border-strong bg-background p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-foreground">
            {errors.length ? <AlertCircle className="h-4 w-4 shrink-0 text-destructive" /> : null}
            {errors.length ? errors[0] : `${changes.length} unpublished ${changes.length === 1 ? "change" : "changes"}`}
          </p>
          <div className="flex shrink-0 justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDraft(config)}>
              Discard
            </Button>
            <Button size="sm" disabled={errors.length > 0} onClick={() => setReviewing(true)}>
              Review and publish
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={reviewing} onOpenChange={(open) => !publishing && setReviewing(open)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Publish pricing</DialogTitle>
            <DialogDescription>
              This goes live for new buyers straight away. Anyone on the pricing page is asked to review the new total before they pay.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[45vh] space-y-4 overflow-y-auto">
            {changes.length === 0 ? <p className="text-sm text-muted-foreground">This matches what&apos;s already live.</p> : null}
            {CHANGE_GROUPS.filter((group) => has(group.kind)).map((group) => (
              <div key={group.kind}>
                <p className="mb-1.5 text-xs font-semibold text-foreground">{group.title}</p>
                <ul className="space-y-1 text-sm">
                  {changes
                    .filter((change) => change.kind === group.kind)
                    .map((change) => (
                      <li key={change.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                        <span className="text-muted-foreground">{change.label}</span>
                        {group.kind === "copy" ? (
                          <span className="text-xs text-muted-foreground">Edited</span>
                        ) : (
                          <span className="font-mono text-xs tabular-nums text-foreground">
                            {change.from} → {change.to}
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          {has("price") || has("limit") ? (
            <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
              FAQ answers and Help Center pages are written by hand and don&apos;t update themselves. Check them for any price or limit you just changed.
            </p>
          ) : null}

          <Textarea
            aria-label="Note for the history"
            placeholder="Why this change? (optional)"
            rows={2}
            maxLength={500}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="resize-none bg-background"
          />

          <DialogFooter>
            <Button variant="ghost" onClick={() => setReviewing(false)} disabled={publishing}>
              Cancel
            </Button>
            <Button onClick={publish} disabled={publishing || changes.length === 0 || errors.length > 0}>
              {publishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
