
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://frgblvloxhcnwrgvjazk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZ2JsdmxveGhjbndyZ3ZqYXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMTY4MzcsImV4cCI6MjA2NDY5MjgzN30.zFOY8tmkFhu-bfm1GiiU6aNwn4Fo1ZETxLMCa7HdM1s'

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
