import { createClient } from '@supabase/supabase-js'

// 使用 import.meta.env 读取环境变量
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 增加一个简单的防御性检查，防止 URL 为空时崩溃
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing!')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')