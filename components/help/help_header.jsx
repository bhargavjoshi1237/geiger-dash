import Link from "next/link";
// Subpath imports, not the barrel: this is a Server Component (see components/header.jsx).
import Logo from "@geiger/ui/logo";
import ThemeToggle from "@geiger/ui/theme-toggle";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { SessionProfile } from "@/components/session-profile";
import { HelpMobileNav } from "@/components/help/help_mobile_nav";
import { HelpSearch } from "@/components/help/help_search";
import { AskAiButton } from "@/components/help/help_ask_ai";
import { HELP_BASE_PATH } from "@/lib/docs/paths";

// Signed-out stand-in for the bell + avatar.
function GuestActions() {
  return (
    <>
      <Link
        href="/login"
        className="flex h-8 items-center rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="ml-1 hidden h-8 items-center rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
      >
        Get started
      </Link>
    </>
  );
}

// Help Center bar laid out like the suite Topbar: brand | search | actions.
export async function HelpHeader({ navigation, activeSlug }) {
  const supabase = await createClient();
  const user = await getUser(supabase);

  return (
    <header className="fixed inset-x-0 top-[var(--geiger-banner-h,0px)] z-50 h-14 border-b border-border bg-background/85 text-foreground backdrop-blur-md">
      <div className="relative flex h-full items-center gap-3 px-4">
        {/* Brand: logo + bordered label; spans the left sidebar so search never starts over the nav column. */}
        <div className="flex min-w-0 shrink-0 items-center gap-1.5 lg:w-[256px]">
          <HelpMobileNav navigation={navigation} activeSlug={activeSlug} />
          <Link
            href="/"
            aria-label="Geiger home"
            className="flex size-8 shrink-0 items-center justify-center rounded transition-colors hover:bg-surface-active lg:-ml-1.5"
          >
            <Logo size={20} className="text-foreground" />
          </Link>
          <div className="flex min-w-0 items-center sm:border-l sm:border-border sm:pl-2">
            <Link href={HELP_BASE_PATH} className="ml-1 min-w-0 truncate text-sm font-semibold text-foreground">
              Help Center
            </Link>
          </div>
        </div>

        {/* Search: from xl the sidebars are symmetric, so a viewport-centred field lines up with the article. */}
        <div className="flex min-w-0 flex-1 items-center justify-end lg:justify-center xl:absolute xl:left-1/2 xl:top-1/2 xl:w-[440px] xl:-translate-x-1/2 xl:-translate-y-1/2">
          <HelpSearch navigation={navigation} />
        </div>

        {/* Actions: the Ask AI pill, then theme / bell / avatar, all gap-2 like the suite header. */}
        <div className="ml-auto flex shrink-0 items-center gap-4">
          <AskAiButton />
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:flex" />
            {user ? <SessionProfile user={user} /> : <GuestActions />}
          </div>
        </div>
      </div>
    </header>
  );
}
