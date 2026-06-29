'use client'

import { EntitlementsContext, CreateProjectDialog } from './organization-projects-client'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NewProjectButton({ organizationId, entitlements }) {
  return (
    <EntitlementsContext.Provider value={entitlements}>
      <CreateProjectDialog
        organizationId={organizationId}
        trigger={
          <Button size="sm" className="h-8 gap-1.5">
            <Plus className="size-4" />
            New project
          </Button>
        }
      />
    </EntitlementsContext.Provider>
  )
}
