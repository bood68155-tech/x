import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jeyoouvzszefnhwzjeaa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_WV8ZTTdaTyxLD84Zaw7T8g_Y6tw3-fu'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
