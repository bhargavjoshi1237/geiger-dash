import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { PostKeysScreen } from '@/components/content-studio/post-keys-screen'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { searchParam } from '@/lib/studio/form'
import { isContentEditor } from '@/lib/studio/access'
import { listPostKeys } from '@/lib/posts/key-queries'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'API keys',
}

export default async function StudioApiKeysPage({ searchParams }) {
  const params = await searchParams
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/studio/api-keys')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  return <PostKeysScreen keys={await listPostKeys(user.id)} selectedId={searchParam(params, 'key')} />
}
