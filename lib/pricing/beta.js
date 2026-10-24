// Options for the beta request form, shared by the dialog and the server action that validates it.
import { AVAILABLE_PRODUCT_APPS } from "@/lib/org/product-apps";

export const BETA_TEAM_SIZES = ["Just me", "2–10", "11–50", "51–200", "201+"];

export const BETA_APPS = AVAILABLE_PRODUCT_APPS.map(({ id, name }) => ({ id, name }));

export const BETA_LIMITS = { name: 120, email: 200, company: 120, useCase: 2000 };
