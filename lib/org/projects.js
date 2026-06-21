import { createClient } from "@/utils/supabase/server";
import { PRODUCT_APPS } from "./product-apps";

const PRODUCT_BY_ID = new Map(PRODUCT_APPS.map((product) => [product.id, product]));

function normalizeProductId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^geiger[-_\s]*/, "")
    .replace(/[^a-z0-9_-]/g, "");
}

function collectProductIds(value, found = new Set()) {
  if (!value) return found;

  if (typeof value === "string") {
    const id = normalizeProductId(value);
    if (PRODUCT_BY_ID.has(id)) found.add(id);
    return found;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectProductIds(item, found);
    }
    return found;
  }

  if (typeof value === "object") {
    for (const key of ["id", "slug", "product", "name"]) {
      collectProductIds(value[key], found);
    }

    for (const key of ["products", "selectedProducts", "selected_products", "apps", "modules"]) {
      collectProductIds(value[key], found);
    }
  }

  return found;
}

function getPurchasedProducts(plan) {
  const ids = collectProductIds(plan);

  return PRODUCT_APPS.filter((product) => ids.has(product.id));
}

function getProjectTitle(plan) {
  if (!plan || typeof plan !== "object" || Array.isArray(plan)) {
    return null;
  }

  const title = typeof plan.title === "string" ? plan.title.trim() : "";

  return title || null;
}

function withProjectIds(products, project) {
  return products.map((product) => ({
    ...product,
    projectId: product.projectColumn ? project?.[product.projectColumn] || null : null,
  }));
}

export async function getOrganizationProjects(organizationId) {
  const supabase = await createClient();

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("id, name, description, created_at, is_active, country, phone")
    .eq("id", organizationId)
    .single();

  if (organizationError) {
    return {
      organization: null,
      projects: [],
      error: organizationError.message,
    };
  }

  const { data, error } = await supabase
    .from("organization_project")
    .select(`
      id,
      created_at,
      projects (
        id,
        flow_project_id,
        dam_project_id,
        notes_project_id,
        grey_project_id,
        office_project_id,
        forms_project_id,
        events_project_id,
        content_project_id,
        pods_project_id,
        comms_project_id,
        chat_project_id,
        canvas_project_id,
        docs_project_id
      ),
      plan (
        id,
        plan
      )
    `)
    .eq("organisition", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      organization,
      projects: [],
      error: error.message,
    };
  }

  return {
    organization,
    projects: (data || []).map((row) => {
      const project = Array.isArray(row.projects) ? row.projects[0] : row.projects;
      const planRecord = Array.isArray(row.plan) ? row.plan[0] : row.plan;
      const purchasedProducts = getPurchasedProducts(planRecord?.plan);

      return {
        id: row.id,
        createdAt: row.created_at,
        title: getProjectTitle(planRecord?.plan),
        projectId: project?.id || null,
        planId: planRecord?.id || null,
        products: withProjectIds(purchasedProducts, project),
      };
    }),
    error: null,
  };
}
