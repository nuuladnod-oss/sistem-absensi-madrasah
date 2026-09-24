import { supabase } from '../../lib/supabaseClient'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  isActive: boolean
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export interface AuthResult {
  success: boolean
  session?: AuthSession
  error?: string
}

const INACTIVE_USER_MESSAGE = 'Akun Anda dinonaktifkan. Hubungi Admin.'
const INVALID_CREDENTIALS_MESSAGE = 'Email atau kata sandi tidak cocok.'

export async function signIn(
  credential: string,
  password: string,
): Promise<AuthResult> {
  const email = credential.trim().toLowerCase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.session) {
    return {
      success: false,
      error: INVALID_CREDENTIALS_MESSAGE,
    }
  }

  const userId = data.session.user.id

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, email, full_name, is_active')
    .eq('id', userId)
    .maybeSingle()

  if (profileError || !profile) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: INVALID_CREDENTIALS_MESSAGE,
    }
  }

  if (!profile.is_active) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: INACTIVE_USER_MESSAGE,
    }
  }

  return {
    success: true,
    session: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        isActive: profile.is_active,
      },
    },
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function restoreSession(): Promise<AuthSession | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return null
  }

  const userId = data.session.user.id

  const { data: profile } = await supabase
    .from('users')
    .select('id, email, full_name, is_active')
    .eq('id', userId)
    .maybeSingle()

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut()
    return null
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    user: {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      isActive: profile.is_active,
    },
  }
}

export function onAuthStateChange(
  callback: (session: AuthSession | null) => void,
): () => void {
  const { data: subscription } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (!session) {
        callback(null)
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('id, email, full_name, is_active')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!profile || !profile.is_active) {
        callback(null)
        return
      }

      callback({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        user: {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          isActive: profile.is_active,
        },
      })
    },
  )

  return () => subscription.subscription.unsubscribe()
}

export const AUTH_ERROR_MESSAGES = {
  INACTIVE_USER: INACTIVE_USER_MESSAGE,
  INVALID_CREDENTIALS: INVALID_CREDENTIALS_MESSAGE,
} as const