import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as
    | 'recovery'
    | 'email'
    | 'signup'
    | 'invite'
    | 'magiclink'
    | 'email_change'
    | null

  if (!token_hash || !type) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent('Invalid reset link')}`
    )
  }

  const supabase = createClient()
  const { error } = await supabase.auth.verifyOtp({ token_hash, type })

  if (error) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent('Invalid or expired reset link')}`
    )
  }

  return NextResponse.redirect(`${origin}/update-password`)
}
