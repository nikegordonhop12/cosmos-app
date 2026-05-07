import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signUpWithEmail(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  return { data, error }
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signInWithVK() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'vk' as any,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset`,
  })
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ─── Database helpers ─────────────────────────────────────────────────────────

export async function saveChartToDB(chart: Record<string, unknown>, userId: string) {
  const { data, error } = await supabase
    .from('charts')
    .upsert({ ...chart, user_id: userId, updated_at: new Date().toISOString() })
    .select()
    .single()
  return { data, error }
}

export async function getUserCharts(userId: string) {
  const { data, error } = await supabase
    .from('charts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function saveMatrixToDB(matrix: Record<string, unknown>, userId: string) {
  const { data, error } = await supabase
    .from('matrices')
    .upsert({ ...matrix, user_id: userId, updated_at: new Date().toISOString() })
    .select()
    .single()
  return { data, error }
}

export async function getUserMatrices(userId: string) {
  const { data, error } = await supabase
    .from('matrices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}
