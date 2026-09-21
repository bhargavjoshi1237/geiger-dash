"use client";

// Playground stand-in for the workspace nav hooks: no addons, RBAC or
// per-user nav curation here, so the sidebar always renders the full nav.
import { workspaceNav } from "../sidebar/sidebar_nav";

export function useVisibleNav() {
  return workspaceNav;
}

export function useNavLoading() {
  return false;
}
