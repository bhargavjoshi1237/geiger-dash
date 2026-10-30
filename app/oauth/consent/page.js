import { redirect } from 'next/navigation'
import { GridBackdrop } from '@/components/grid-backdrop'
import { createClient } from '@/utils/supabase/server'
import { getUser } from '@/supabase/user/getUser'
import { listCustomRedirects, listSelectableProjects } from '@/lib/mcp/connections'
import { isAllowedRedirect, isLoopbackRedirect } from '@/lib/mcp/redirects'
import { ConsentForm, ConsentMessage } from './consent-form'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Connect an AI app',
  robots: { index: false, follow: false },
}

function Shell({ children }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-16 text-foreground">
      <GridBackdrop variant="subtle" />
      <main className="relative z-10 w-full max-w-lg">{children}</main>
    </div>
  )
}

// Supabase sends the browser here during an MCP client's OAuth flow; the user sets what the client may reach.
export default async function OAuthConsentPage({ searchParams }) {
  const params = await searchParams
  const authorizationId = typeof params?.authorization_id === 'string' ? params.authorization_id : ''
  if (!authorizationId) {
    return (
      <Shell>
        <ConsentMessage title="Nothing to approve" body="Start the connection again from your AI app." />
      </Shell>
    )
  }

  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) {
    const next = `/oauth/consent?authorization_id=${authorizationId}`
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }

  const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId)
  if (error || !data) {
    if (error) console.error('[mcp.consent.page]', error.message)
    return (
      <Shell>
        <ConsentMessage title="This request has expired" body="Start the connection again from your AI app." />
      </Shell>
    )
  }

  // Supabase answers with only a redirect when the user already approved this client.
  if (!data.authorization_id && data.redirect_url) redirect(data.redirect_url)

  const customRedirects = await listCustomRedirects(supabase, user.id)
  if (!isAllowedRedirect(data.redirect_uri, process.env, customRedirects)) {
    return (
      <Shell>
        <ConsentMessage
          title="This app isn't supported yet"
          body={`${data.client?.name || 'This app'} isn't on the list of AI clients Geiger can connect to, so nothing was shared. To allow it, add its callback URL under Settings, then AI Apps, in Events.`}
        />
      </Shell>
    )
  }

  const projects = await listSelectableProjects(supabase)

  return (
    <Shell>
      <ConsentForm
        authorizationId={data.authorization_id}
        clientName={data.client?.name || 'An AI app'}
        isLocalClient={isLoopbackRedirect(data.redirect_uri)}
        redirectHost={new URL(data.redirect_uri).host}
        userEmail={user.email || ''}
        projects={projects}
      />
    </Shell>
  )
}
