import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is already logged in, redirect immediately
  if (user) {
    const params = await searchParams
    const redirectUrl = params.redirect || '/admin'
    redirect(redirectUrl)
  }

  // Otherwise, show the login form
  return <LoginForm />
}
