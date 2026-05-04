import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { MegaMenu } from "@/components/mega-menu";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950 md:border-zinc-800/50 md:bg-zinc-950/85 md:backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-between px-4 sm:px-6 relative">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo1.svg`} alt="Logo" width={20} height={20} />
          </div>
          <span className="truncate font-bold text-sm tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400 sm:text-md">Geiger Studios</span>
        </div>
        <MegaMenu userId={userId} />
        <div className="hidden items-center gap-4 md:flex">
          {userId ? (
            <>
              <Link
                href={`/notes/${userId}/home`}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
