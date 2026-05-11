'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const DEEP_LINK_BASE = 'https://app.apply.org.za/auth/callback'

interface Props {
  accessToken: string
  refreshToken: string
  expiresIn?: number | null
}

export default function CallbackRedirect({
  accessToken,
  refreshToken,
  expiresIn,
}: Props) {
  const [deepLink] = useState(() => {
    const url = new URL(DEEP_LINK_BASE)
    url.searchParams.set('access_token', accessToken)
    url.searchParams.set('refresh_token', refreshToken)
    if (expiresIn != null) url.searchParams.set('expires_in', String(expiresIn))
    return url.toString()
  })

  useEffect(() => {
    // Meta-refresh fallback for environments where JS redirect is blocked.
    const meta = document.createElement('meta')
    meta.httpEquiv = 'refresh'
    meta.content = `0; url=${deepLink}`
    document.head.appendChild(meta)

    window.location.href = deepLink
  }, [deepLink])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-dark px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <Image
          src="https://assets.apply.org.za/u-files/Logos/UniApplyForMeWhite.svg"
          alt="UniApplyForMe"
          width={200}
          height={58}
          priority
          unoptimized
        />
        <div className="w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-5 text-center">
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
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold text-gray-900">
              Signed in successfully
            </h1>
            <p className="text-sm text-gray-500">
              Redirecting you back to the app…
            </p>
          </div>
          <p className="text-xs text-gray-400">
            If nothing happens,{' '}
            <a
              href={deepLink}
              className="text-brand-green underline font-medium"
            >
              tap here to open the app
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
