'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://auth.apply.org.za/auth/confirm',
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-dark px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <Image
          src="https://assets.apply.org.za/u-files/Logos/UniApplyForMeWhite.svg"
          alt="UniApplyForMe"
          width={220}
          height={64}
          priority
          unoptimized
        />

        <div className="w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6">
          {sent ? (
            <>
              <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-brand-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Check your email
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We&apos;ve sent a password reset link to{' '}
                  <span className="font-medium text-gray-700">{email}</span>.
                  The link expires in 1 hour.
                </p>
              </div>
              <Link
                href="/login"
                className="text-sm text-brand-green hover:underline font-medium"
              >
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Reset your password
                </h1>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-green transition-colors"
                />

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-brand-green hover:bg-brand-dark text-white font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </form>

              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
