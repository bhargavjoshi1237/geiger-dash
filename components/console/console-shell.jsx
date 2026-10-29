'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { FilePlus2, Plus } from 'lucide-react'
import { CommandPalette, SidebarProvider, useCommandShortcut } from '@geiger/ui'
import { ConsoleSidebar } from '@/components/console/console-sidebar'
import { CONSOLE_NAV } from '@/components/console/console-nav'
import { LlmSettingsDialog } from '@/components/content-studio/llm-settings-dialog'
import { useLlmConfig } from '@/components/content-studio/llm-config'

const QUICK_ACTIONS = [
  { id: 'new-post', title: 'New post', href: '/studio/posts?post=new', icon: Plus },
  { id: 'new-release', title: 'New release', href: '/studio/releases?release=new', icon: Plus },
  { id: 'new-page', title: 'New SEO page', href: '/studio/pages?page=new', icon: Plus },
  { id: 'new-help-page', title: 'New Help Center page', href: '/studio/help?page=new', icon: FilePlus2 },
]

// Every console destination (and each admin sub-section) as a palette entry.
function paletteItems() {
  const items = CONSOLE_NAV.flatMap((group) =>
    group.items.flatMap((item) => [
      { id: item.key, title: item.label, group: group.label, icon: item.icon, href: item.href },
      ...(item.subs || []).map((sub) => ({
        id: `${item.key}/${sub.key}`,
        title: `${item.label} · ${sub.label}`,
        group: group.label,
        icon: item.icon,
        href: `${item.href}?section=${sub.key}`,
      })),
    ]),
  )
  return [...items, ...QUICK_ACTIONS.map((action) => ({ ...action, group: 'Create' }))]
}
const PALETTE_ITEMS = paletteItems()

// Full-height Console frame shared by Studio and Admin, starting below the global notice strip; editor screens (all of /studio) get the 56px rail.
export function ConsoleShell({ counts, noticeLive, account, children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isConfigured } = useLlmConfig()
  const [searchOpen, setSearchOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const rail = pathname.startsWith('/studio')

  const toggleSearch = useCallback(() => setSearchOpen((open) => !open), [])
  useCommandShortcut(toggleSearch)

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }
  }, [])

  return (
    <SidebarProvider open onOpenChange={() => {}} className="fixed inset-x-0 bottom-0 top-[var(--geiger-banner-h,0px)] min-h-0 overflow-hidden bg-background text-foreground">
      <ConsoleSidebar
        rail={rail}
        counts={counts}
        noticeLive={noticeLive}
        account={account}
        aiConnected={isConfigured}
        onSearch={() => setSearchOpen(true)}
        onAi={() => setAiOpen(true)}
      />
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain">{children}</main>

      <CommandPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        items={PALETTE_ITEMS}
        onSelect={(item) => router.push(item.href)}
        placeholder="Jump to a screen or create something…"
        rootGroupLabel="Console"
        recentsKey="geiger:console:recents"
      />
      <LlmSettingsDialog open={aiOpen} onOpenChange={setAiOpen} />
    </SidebarProvider>
  )
}
