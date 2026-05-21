export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
