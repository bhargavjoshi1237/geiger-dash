'use client'

import Link from 'next/link'
import { ArrowUpRight, LayoutGrid, LockKeyhole } from 'lucide-react'
import { Button, Tabs, TabsList, TabsTrigger } from '@geiger/ui'

const STUDIO_TABS = [
  { value: 'posts', label: 'Posts', href: '/studio/posts' },
  { value: 'pages', label: 'Pages', href: '/studio/pages' },
  { value: 'help', label: 'Help', href: '/studio/help' },
]

// Switches between the Studio screens; each is its own route.
export function StudioTabs({ active }) {
  return (
    <Tabs value={active} className="hidden sm:block">
      <TabsList>
        {STUDIO_TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link href={tab.href}>{tab.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

// Shown on every Studio screen to signed-in users who aren't on the content editors list.
export function StudioNoAccess({ active }) {
  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
            <LayoutGrid className="size-4" />
            <span className="sr-only">Back to Geiger</span>
          </Link>
          <h1 className="truncate text-sm font-semibold">Geiger Studio</h1>
        </div>
        <StudioTabs active={active} />
      </header>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-sm space-y-3 text-center">
          <LockKeyhole className="mx-auto size-6 text-muted-foreground" />
          <h2 className="text-base font-semibold">Studio is for content editors</h2>
          <p className="text-sm text-muted-foreground">
            Only content editors can manage the blog, changelog, SEO pages and Help Center. Ask an existing editor to
            add your account to the content editors list.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              Back to Geiger
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
