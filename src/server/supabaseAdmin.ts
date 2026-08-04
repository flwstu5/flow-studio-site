import { createClient } from '@supabase/supabase-js'

// Shared service-role client — bypasses RLS, server-only. Used by both the
// intake form (creating portal accounts) and the snapshot tool (saving
// reports against an existing client, when the emails match).
export function getAdminClient() {
  return createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
