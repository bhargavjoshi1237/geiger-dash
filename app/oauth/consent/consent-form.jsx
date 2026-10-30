'use client'

import { useMemo, useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Switch } from '@geiger/ui'
import { SettingsBlock } from '@/components/account/panel'
import { approveConsentAction, denyConsentAction } from './actions'

export function ConsentMessage({ title, body }) {
  return <SettingsBlock title={title} description={body} />
}

export function ConsentForm({ authorizationId, clientName, isLocalClient, redirectHost, userEmail, projects }) {
  const [selected, setSelected] = useState(() => (projects.length === 1 ? [projects[0].id] : []))
  const [allowWrites, setAllowWrites] = useState(false)
  const [pendingAction, setPendingAction] = useState('')
  const [isPending, startTransition] = useTransition()

  const groups = useMemo(() => {
    const byOrganization = new Map()
    for (const project of projects) {
      const list = byOrganization.get(project.organizationName) || []
      list.push(project)
      byOrganization.set(project.organizationName, list)
    }
    return [...byOrganization.entries()]
  }, [projects])

  function toggleProject(id) {
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))
  }

  function submit(action, run) {
    setPendingAction(action)
    startTransition(async () => {
      const result = await run()
      if (result?.ok) {
        window.location.assign(result.redirectUrl)
        return
      }
      setPendingAction('')
      toast.error(result?.error || 'Something went wrong. Please try again.')
    })
  }

  const approve = () =>
    submit('approve', () =>
      approveConsentAction({ authorizationId, projectIds: selected, access: allowWrites ? 'write' : 'read' }),
    )
  const deny = () => submit('deny', () => denyConsentAction({ authorizationId }))

  return (
    <SettingsBlock
      title={`Connect ${clientName} to Geiger`}
      description={`Signed in as ${userEmail}. It will act as you, and your roles in each project still apply.`}
      footer={
        <>
          <span className="min-w-0 truncate">
            {isLocalClient ? 'Sends you back to an app on this device' : `Sends you back to ${redirectHost}`}
          </span>
          <span className="flex items-center gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={deny} disabled={isPending}>
              {pendingAction === 'deny' ? <Loader2 className="size-4 animate-spin" /> : null}
              Deny
            </Button>
            <Button type="button" size="sm" onClick={approve} disabled={isPending || selected.length === 0}>
              {pendingAction === 'approve' ? <Loader2 className="size-4 animate-spin" /> : null}
              Connect
            </Button>
          </span>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-medium text-foreground">Projects it can reach</h3>
          {projects.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              You don&apos;t have any projects yet. Create one, then connect again.
            </p>
          ) : (
            <div className="mt-2 max-h-64 space-y-3 overflow-y-auto">
              {groups.map(([organizationName, list]) => (
                <fieldset key={organizationName}>
                  <legend className="mb-1 text-xs text-text-tertiary">{organizationName}</legend>
                  {list.map((project) => (
                    <label
                      key={project.id}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-surface-hover"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(project.id)}
                        onChange={() => toggleProject(project.id)}
                        className="size-4 accent-primary"
                      />
                      <span className="min-w-0 truncate">{project.name}</span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 border-t border-border pt-4">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground">Allow changes</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Off means it can only read. On lets it create and edit events and act on registrations. It can&apos;t
              issue refunds or take payments either way.
            </p>
          </div>
          <Switch checked={allowWrites} onCheckedChange={setAllowWrites} aria-label="Allow changes" />
        </div>
      </div>
    </SettingsBlock>
  )
}
