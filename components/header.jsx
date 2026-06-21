import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/supabase/user/getUser";
import { MegaMenu } from "@/components/mega-menu";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import ThemeToggle from "@/components/ui/theme-toggle";

function HeaderContent({ user = null, megaMenue }) {
  const userId = user?.id;
  const userProfile = userId
    ? {
        id: userId,
        email: user.email,
        name: user.user_metadata?.name,
        fullName: user.user_metadata?.full_name,
        avatarUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pfp/${userId}/latest.jpg`
          : "",
        dashboardHref: "/org",
      }
    : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background md:border-border/50 md:bg-background/85 md:backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-4 sm:px-6 relative">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg`} alt="Logo" width={20} height={20} />
          </div>
          <span className="truncate text-sm font-bold tracking-tight text-foreground dark:bg-gradient-to-r dark:from-zinc-100 dark:to-zinc-400 dark:bg-clip-text dark:text-transparent sm:text-md">
            Geiger Studios
          </span>
        </div>
        {megaMenue ? <MegaMenu userId={userId} /> : null}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          {userProfile ? (
            <UserProfileDropdown user={userProfile} />
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export async function Header({ megaMenue = true }) {
  const supabase = await createClient();
  const user = await getUser(supabase);

  return <HeaderContent user={user} megaMenue={megaMenue} />;
}
