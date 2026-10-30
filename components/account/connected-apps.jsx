'use client'

import { useState, useTransition } from 'react'
import { Loader2, Unplug } from 'lucide-react'
import { toast } from 'sonner'
import { Badge, Button } from '@geiger/ui'
import { SettingsBlock } from '@/components/account/panel'
import { revokeMcpConnectionAction } from '@/app/profile/actions'

function formatDate(value) {
  if (!value) return 'Not used yet'
  return `Last used ${new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))}`
}

// AI clients connected over MCP, each with its access level and a way to cut it off.
export function ConnectedApps({ connections: initialConnections }) {
  const [connections, setConnections] = useState(initialConnections)
  const [revokingId, setRevokingId] = useState('')
  const [isPending, startTransition] = useTransition()

  function revoke(connection) {
    setRevokingId(connection.id)
    startTransition(async () => {
      const result = await revokeMcpConnectionAction(connection.id)
      setRevokingId('')
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      setConnections((current) => current.filter((item) => item.id !== connection.id))
      toast.success(`${connection.clientName} disconnected`)
    })
  }

  return (
    <SettingsBlock
      title="Connected apps"
      description="AI apps you've allowed to work in Geiger on your behalf. Disconnecting ends their access straight away."
      flush={connections.length > 0}
    >
      {connections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No AI apps are connected.</p>
      ) : (
        connections.map((connection) => (
          <div key={connection.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">{connection.clientName}</span>
                <Badge variant={connection.access === 'write' ? 'warning' : 'secondary'}>
                  {connection.access === 'write' ? 'Can make changes' : 'Read only'}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {connection.projectIds.length} {connection.projectIds.length === 1 ? 'project' : 'projects'} ·{' '}
                {formatDate(connection.lastUsedAt)}
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={() => revoke(connection)} disabled={isPending}>
              {revokingId === connection.id ? <Loader2 className="size-4 animate-spin" /> : <Unplug className="size-4" />}
              Disconnect
            </Button>
          </div>
        ))
      )}
    </SettingsBlock>
  )
}
