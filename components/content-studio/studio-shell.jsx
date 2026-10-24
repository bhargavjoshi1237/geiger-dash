'use client'

import Link from 'next/link'
import { ArrowUpRight, LockKeyhole } from 'lucide-react'
import { Button, EmptyState } from '@geiger/ui'

// Shown on every Studio screen to signed-in users who aren't on the content editors list.
export function StudioNoAccess() {
  return (
    <EmptyState
      icon={LockKeyhole}
      title="Studio is for content editors"
      description="Only content editors can manage the blog, changelog, SEO pages and Help Center. Ask an existing editor to add your account to the content editors list."
      className="[&_p]:normal-case"
      action={
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            Back to Geiger
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      }
    />
  )
}
