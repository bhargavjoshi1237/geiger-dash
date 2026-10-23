"use server";

import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { answerDocsQuestion } from "@/lib/docs/ask";
import { getDocsSearchEntries } from "@/lib/docs/queries";

const MAX_QUESTION_CHARS = 1000;

// Loaded when the ⌘K palette first opens, so page renders don't carry the whole search index.
export async function getHelpSearchEntriesAction() {
  return getDocsSearchEntries();
}

// Ask AI is limited to signed-in users so an anonymous visitor can't run up provider costs.
export async function askHelpAction({ question, pageSlug, history } = {}) {
  const text = String(question || "").trim().slice(0, MAX_QUESTION_CHARS);
  if (!text) return { ok: false, error: "Type a question first." };

  const supabase = await createClient();
  const user = await getUser(supabase);
  if (!user) return { ok: false, code: "signin", error: "Sign in to ask AI about the help center." };

  try {
    return await answerDocsQuestion({ question: text, pageSlug: String(pageSlug || ""), history });
  } catch (error) {
    console.error("[help.ask]", error);
    return { ok: false, error: "Couldn't get an answer right now. Try again in a moment." };
  }
}
