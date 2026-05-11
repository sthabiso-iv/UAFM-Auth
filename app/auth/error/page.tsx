import { Suspense } from 'react'
import ErrorContent from './error-content'

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-brand-dark">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
