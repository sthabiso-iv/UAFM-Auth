import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CallbackRedirect from './callback-redirect'

interface PageProps {
  searchParams: {
    code?: string
    error?: string
    error_description?: string
  }
}

export default async function AuthCallbackPage({ searchParams }: PageProps) {
  const { code, error, error_description } = searchParams

  if (error) {
    const msg = error_description ?? error
    redirect(`/auth/error?message=${encodeURIComponent(msg)}`)
  }

  if (!code) {
    redirect(
      `/auth/error?message=${encodeURIComponent('No authorization code received')}`
    )
  }

  const supabase = createClient()
  const { data, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError || !data.session) {
    redirect(
      `/auth/error?message=${encodeURIComponent('Session exchange failed')}`
    )
  }

  const { access_token, refresh_token, expires_in } = data.session

  return (
    <CallbackRedirect
      accessToken={access_token}
      refreshToken={refresh_token}
      expiresIn={expires_in}
    />
  )
}
