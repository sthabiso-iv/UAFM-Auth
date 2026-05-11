'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ErrorContent() {
  const searchParams = useSearchParams()
  const message =
    searchParams.get('message') ?? 'An unexpected error occurred during sign-in'

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

        <div className="w-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-semibold text-gray-900">
              Sign-in failed
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed break-words">
              {message}
            </p>
          </div>

          <Link
            href="/login"
            className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-brand-green hover:bg-brand-dark text-white font-medium text-sm transition-colors"
          >
            Try again
          </Link>
        </div>

        <p className="text-white/40 text-xs text-center">
          auth.apply.org.za — secure OAuth relay
        </p>
      </div>
    </main>
  )
}
