export async function getUser(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function requireUser(supabase, redirectTo = '/login?next=org') {
  const user = await getUser(supabase)

  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect(redirectTo)
  }

  return user
}