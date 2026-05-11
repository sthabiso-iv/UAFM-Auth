// This route is unused in the normal OAuth flow.
// Tokens are delivered directly by /auth/callback (page.tsx Server Component).
// This file exists only as a named route in case of direct navigation.
import { redirect } from 'next/navigation'

export default function SuccessPage() {
  redirect('/login')
}
