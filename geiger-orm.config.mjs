// Migration config for @geiger/orm. This product's tables live in the dedicated
// "public" Postgres schema of the suite-shared Supabase project, and so does
// its migration ledger (public.geiger_migrations).
export default {
  schema: "public",
  url: process.env.DIRECT_URL,
};
