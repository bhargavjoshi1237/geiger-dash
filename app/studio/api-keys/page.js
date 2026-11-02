import { createClient } from '@/utils/supabase/server'
import { requireUser } from '@/supabase/user/getUser'
import { PostKeysScreen } from '@/components/content-studio/post-keys-screen'
import { StudioNoAccess } from '@/components/content-studio/studio-shell'
import { isContentEditor } from '@/lib/studio/access'
import { listPostKeys } from '@/lib/posts/key-queries'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'API keys',
}

export default async function StudioApiKeysPage() {
  const supabase = await createClient()
  const user = await requireUser(supabase, '/login?next=/studio/api-keys')
  if (!(await isContentEditor(supabase))) return <StudioNoAccess />

  return <PostKeysScreen keys={await listPostKeys(user.id)} />
}
