import { createClient } from '@supabase/supabase-js'
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
export const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
// export const supabaseServer = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)