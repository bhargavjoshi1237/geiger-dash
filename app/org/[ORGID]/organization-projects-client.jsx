"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ExpandableSearch } from "@geiger/ui";
import { ERROR_MESSAGES } from "./_components/constants";
import { EntitlementsContext } from "./_components/entitlements";
import { NoMatchesState, NoProjectsState } from "./_components/project-empty-states";
import { ProjectRow } from "./_components/project-row";

export function OrganizationProjectsClient({
  organizationId,
  organizationName = "",
  projects,
  notificationParams,
  entitlements = null,
}) {
  const router = useRouter();
  const notifiedRef = useRef(false);
  const [search, setSearch] = useState("");

  // Stable display names independent of filter order.
  const nameById = useMemo(() => {
    const map = new Map();
    projects.forEach((project, index) => {
      map.set(project.id, project.title?.trim() || project.name?.trim() || `Project ${index + 1}`);
    });
    return map;
  }, [projects]);

  useEffect(() => {
    if (notifiedRef.current || !notificationParams) return;
    const { projectCreated, projectError, projectRenamed, projectDeleted, projectUpdated } = notificationParams;
    if (!projectCreated && !projectError && !projectRenamed && !projectDeleted && !projectUpdated) return;

    notifiedRef.current = true;
    if (projectCreated) toast.success("Project created.");
    else if (projectRenamed) toast.success("Project renamed.");
    else if (projectDeleted) toast.success("Project deleted.");
    else if (projectUpdated) toast.success("Project updated.");
    else if (projectError) toast.error(ERROR_MESSAGES[projectError] || projectError);
    router.replace(`/org/${organizationId}`, { scroll: false });
  }, [notificationParams, organizationId, router]);

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      const name = (nameById.get(project.id) || "").toLowerCase();
      const productText = project.products.map((p) => p.name).join(" ").toLowerCase();
      const idText = `${project.projectId || ""} ${project.title || ""}`.toLowerCase();
      return !query || name.includes(query) || productText.includes(query) || idText.includes(query);
    });
    return [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [projects, search, nameById]);

  const hasFilters = !!search.trim();

  function clearFilters() {
    setSearch("");
  }

  return (
    <EntitlementsContext.Provider value={entitlements}>
      {!projects.length ? (
        <NoProjectsState organizationId={organizationId} />
      ) : (
        <div className="space-y-4">
          {/* Count on the left, search collapsed to an icon on the far right. */}
          <div className="sticky top-0 z-10 -mx-1 flex h-12 items-center justify-between gap-3 bg-background/95 px-1 text-xs text-muted-foreground backdrop-blur">
            <span className="min-w-0 truncate text-sm font-medium text-foreground">
              {organizationName ? `Projects in ${organizationName}` : "Projects"}
              {hasFilters && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {visibleProjects.length} of {projects.length}
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-3" />
                  Clear filters
                </button>
              )}
              <ExpandableSearch
                value={search}
                onChange={setSearch}
                placeholder="Search Projects"
                label="Search projects"
                className="-mr-1"
                inputClassName="focus-visible:border-input focus-visible:ring-0"
              />
            </div>
          </div>

          {!visibleProjects.length ? (
            <NoMatchesState onClear={clearFilters} />
          ) : (
            <div className="space-y-2.5">
              {visibleProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  name={nameById.get(project.id)}
                  organizationId={organizationId}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </EntitlementsContext.Provider>
  );
}
