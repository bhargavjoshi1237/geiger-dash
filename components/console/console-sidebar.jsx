'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronRight, ChevronsUpDown, LayoutGrid, Lock, LockOpen, Search, Sparkles } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Kbd,
  Logo,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
  useModifierKeyLabel,
} from '@geiger/ui'
import { SignOutMenuItem } from '@/components/sign-out-menu-item'
import { lockAdmin, useAdminUnlocked } from '@/components/admin/admin-gate'
import { CONSOLE_NAV } from '@/components/console/console-nav'

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : (parts[0] || '?').slice(0, 2)).toUpperCase()
}

function useNavState() {
  const pathname = usePathname()
  const section = useSearchParams().get('section') || ''
  const isActive = (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  return { pathname, section, isActive }
}

function LiveDot({ label = 'Live' }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
      <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
      {label}
    </span>
  )
}

function UserAvatar({ account, className }) {
  return (
    <Avatar className={cn('size-7', className)}>
      {account.avatarUrl ? <AvatarImage src={account.avatarUrl} alt="" /> : null}
      <AvatarFallback className="bg-surface-hover text-xs text-foreground">{initials(account.name)}</AvatarFallback>
    </Avatar>
  )
}

function AccountMenu({ account, side = 'top', children }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="end" className="w-56 border-border bg-surface-subtle">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium text-foreground">{account.name}</p>
          {account.email ? <p className="truncate text-xs text-muted-foreground">{account.email}</p> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/">
            <LayoutGrid className="size-3.5" />
            Back to Geiger
          </Link>
        </DropdownMenuItem>
        <SignOutMenuItem />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Admin is behind a session password; the label shows the lock and re-locks on click.
function AdminLockStatus() {
  const unlocked = useAdminUnlocked()
  const Icon = unlocked ? LockOpen : Lock
  return (
    <button
      type="button"
      onClick={unlocked ? lockAdmin : undefined}
      disabled={!unlocked}
      title={unlocked ? 'Lock admin for this session' : undefined}
      className="inline-flex items-center gap-1 rounded text-[11px] font-normal normal-case tracking-normal transition-colors enabled:hover:text-foreground"
    >
      <Icon className="size-3" />
      {unlocked ? 'Session unlocked' : 'Locked'}
    </button>
  )
}

// Sub-links on the current route swap ?section= in place; elsewhere they navigate.
function SubLink({ href, pathname, itemHref, children }) {
  const onClick = (event) => {
    if (pathname !== itemHref) return
    event.preventDefault()
    window.history.replaceState(null, '', href)
  }
  return (
    <Link href={href} onClick={onClick}>
      {children}
    </Link>
  )
}

function FullNavItem({ item, active, section, pathname, count, noticeLive }) {
  const Icon = item.icon
  const hasSubs = Boolean(item.subs?.length)
  const activeSub = active && hasSubs ? section : ''
  const Chevron = active ? ChevronDown : ChevronRight

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active && !activeSub} className={active ? 'text-foreground' : ''}>
        <Link href={item.href}>
          <Icon />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {count !== undefined ? <span className="text-[11px] tabular-nums text-text-secondary">{count}</span> : null}
          {item.live && noticeLive ? <LiveDot /> : null}
          {hasSubs ? (
            <span className="text-text-secondary">
              <Chevron className="size-3.5" />
            </span>
          ) : null}
        </Link>
      </SidebarMenuButton>
      {active && hasSubs ? (
        <SidebarMenuSub>
          {item.subs.map((sub) => (
            <SidebarMenuSubItem key={sub.key}>
              <SidebarMenuSubButton asChild isActive={activeSub === sub.key}>
                <SubLink href={`${item.href}?section=${sub.key}`} pathname={pathname} itemHref={item.href}>
                  <span>{sub.label}</span>
                </SubLink>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  )
}

function FullSidebar({ counts, noticeLive, account, aiConnected, onSearch, onAi, className }) {
  const { pathname, section, isActive } = useNavState()
  const modifierKey = useModifierKeyLabel()

  return (
    <Sidebar collapsible="none" className={cn('h-full w-[232px] shrink-0 border-r border-sidebar-border', className)}>
      <div className="flex h-[52px] shrink-0 items-center gap-2.5 border-b border-sidebar-border pl-3.5 pr-2.5">
        <Logo size={22} className="shrink-0 text-foreground" />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[13px] font-semibold text-foreground">Geiger</span>
          <span className="text-[11px] text-muted-foreground">Console</span>
        </div>
        <Button asChild variant="ghost" size="icon-sm" className="ml-auto text-muted-foreground">
          <Link href="/" aria-label="Back to Geiger">
            <LayoutGrid className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="px-2.5 pb-1 pt-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSearch}
          className="w-full justify-start bg-surface-subtle font-normal text-muted-foreground"
        >
          <Search className="size-3.5" />
          <span className="flex-1 text-left">Search</span>
          <Kbd className="border border-border bg-surface-card px-1.5 text-[11px] text-muted-foreground">{modifierKey}K</Kbd>
        </Button>
      </div>

      <SidebarContent>
        {CONSOLE_NAV.map((group) => (
          <SidebarGroup key={group.key}>
            <SidebarGroupLabel className="justify-between text-[11px] uppercase tracking-[0.08em] text-text-secondary">
              <span>{group.label}</span>
              {group.locked ? <AdminLockStatus /> : null}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <FullNavItem
                  key={item.key}
                  item={item}
                  active={isActive(item)}
                  section={section}
                  pathname={pathname}
                  count={item.count ? counts?.[item.count] : undefined}
                  noticeLive={noticeLive}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <div className="flex flex-col gap-0.5 border-t border-sidebar-border p-2">
        <SidebarMenuButton type="button" onClick={onAi}>
          <Sparkles className={aiConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'} />
          <span className="flex-1">AI model</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={cn('size-1.5 rounded-full', aiConnected ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-muted-foreground')} />
            {aiConnected ? 'Connected' : 'Not set'}
          </span>
        </SidebarMenuButton>
        {account ? (
          <AccountMenu account={account}>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <UserAvatar account={account} />
              <span className="flex min-w-0 flex-1 flex-col leading-snug">
                <span className="truncate text-[13px] font-medium text-foreground">{account.name}</span>
                <span className="truncate text-[11px] text-muted-foreground">{account.role}</span>
              </span>
              <ChevronsUpDown className="size-3.5" />
            </SidebarMenuButton>
          </AccountMenu>
        ) : null}
      </div>
    </Sidebar>
  )
}

function RailButton({ label, active, children, ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <SidebarMenuButton isActive={active} aria-label={label} className="size-9 justify-center p-0" {...props}>
          {children}
        </SidebarMenuButton>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

// 56px icon rail for editor screens, so the panes get the room.
function RailSidebar({ counts, noticeLive, account, aiConnected, onSearch, onAi, className }) {
  const { isActive } = useNavState()

  return (
    <Sidebar collapsible="none" className={cn('h-full w-14 shrink-0 items-center border-r border-sidebar-border', className)}>
      <Link
        href="/"
        aria-label="Back to Geiger"
        className="flex h-[52px] w-full shrink-0 items-center justify-center border-b border-sidebar-border text-foreground"
      >
        <Logo size={22} />
      </Link>
      <div className="flex w-full min-h-0 flex-1 flex-col items-center gap-0.5 overflow-y-auto pt-2.5">
        <div className="pb-2">
          <RailButton label="Search" onClick={onSearch}>
            <Search className="size-4" />
          </RailButton>
        </div>
        {CONSOLE_NAV.map((group) => (
          <div key={group.key} className="flex w-full flex-col items-center gap-0.5 border-t border-sidebar-border py-2">
            {group.items.map((item) => {
              const Icon = item.icon
              const count = item.count ? counts?.[item.count] : undefined
              const live = item.live && noticeLive
              return (
                <RailButton
                  key={item.key}
                  label={`${item.label}${count !== undefined ? ` · ${count}` : ''}${live ? ' · Live' : ''}`}
                  active={isActive(item)}
                  asChild
                >
                  <Link href={item.href} className="relative">
                    <Icon className="size-4" />
                    {live ? <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> : null}
                  </Link>
                </RailButton>
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex w-full flex-col items-center gap-2 border-t border-sidebar-border py-3">
        <RailButton label={aiConnected ? 'AI model · Connected' : 'AI model · Not set'} onClick={onAi}>
          <Sparkles className={cn('size-4', aiConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')} />
        </RailButton>
        {account ? (
          <AccountMenu account={account} side="right">
            <button type="button" aria-label="Account" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
              <UserAvatar account={account} />
            </button>
          </AccountMenu>
        ) : null}
      </div>
    </Sidebar>
  )
}

export function ConsoleSidebar({ rail = false, ...props }) {
  if (rail) return <RailSidebar {...props} />
  // Below md the full sidebar would crowd the screen, so it folds to the rail there too.
  return (
    <>
      <FullSidebar {...props} className="hidden md:flex" />
      <RailSidebar {...props} className="md:hidden" />
    </>
  )
}
