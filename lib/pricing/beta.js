// Apps a Alpha tester can pick, shared by the beta dialog and the server action that validates it.
import { AVAILABLE_PRODUCT_APPS } from "@/lib/org/product-apps";

export const BETA_APPS = AVAILABLE_PRODUCT_APPS.map(({ id, name, detail }) => ({ id, name, detail }));
