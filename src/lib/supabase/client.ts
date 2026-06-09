import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Provide dummy values during build time if env vars are missing
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  return createBrowserClient(url, key)
}
