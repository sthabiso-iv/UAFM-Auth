'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace(
          '/auth/error?message=' + encodeURIComponent('Reset link expired')
        )
      }
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
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
          {done ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Password updated
                </h1>
                <p className="text-sm text-gray-500">
                  Your password has been updated successfully.
                </p>
              </div>
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-brand-green hover:bg-brand-dark text-white font-medium text-sm transition-colors"
              >
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Set a new password
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <input
                  type="password"
                  required
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-green transition-colors"
                />
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
                    'Update password'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
