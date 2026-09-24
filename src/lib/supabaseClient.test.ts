import { describe, it, expect } from 'vitest'

describe('Supabase client configuration', () => {
  it('should have env vars defined', () => {
    const url = import.meta.env.VITE_SUPABASE_URL as string
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
    expect(url).toBeTruthy()
    expect(key).toBeTruthy()
    expect(url).toContain('supabase.co')
  })

  it('should expose auth and from helpers', async () => {
    const { supabase } = await import('./supabaseClient')
    expect(typeof supabase.auth).toBe('object')
    expect(typeof supabase.from).toBe('function')
    expect(typeof supabase.storage).toBe('object')
  })
})