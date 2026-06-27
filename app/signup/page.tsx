'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — decorative */}
      <div className="hidden w-1/2 lg:flex items-center justify-center bg-gradient-to-br from-kenzo-deep via-kenzo-surface to-teal-950/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.08),transparent_50%)]" />
        <div className="relative z-10 text-center px-12">
          <Link href="/" className="inline-block font-[family-name:var(--font-lora)] text-3xl font-bold text-white tracking-tight mb-4">
            Kenzo
          </Link>
          <p className="text-kenzo-text-secondary text-lg max-w-sm mx-auto">
            Join coaches and agency owners building high-ticket funnels with AI.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center bg-kenzo-deep px-4 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block text-center font-[family-name:var(--font-lora)] text-2xl font-bold text-white mb-8">
            Kenzo
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-kenzo-text">Create your account</h1>
            <p className="mt-1.5 text-sm text-kenzo-text-muted">Start building funnels for free.</p>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-6 mb-8 border-b border-kenzo-border-subtle">
            <Link href="/login" className="pb-2.5 text-sm font-medium text-kenzo-text-muted hover:text-kenzo-text-secondary transition-colors">
              Sign in
            </Link>
            <span className="pb-2.5 text-sm font-medium text-kenzo-text border-b-2 border-kenzo-accent -mb-px">
              Sign up
            </span>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Input
              type="password"
              label="Confirm password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-xs text-kenzo-danger bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <Divider text="or" className="my-6" />

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            disabled
            title="Google sign-in coming soon"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-kenzo-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-kenzo-text-secondary hover:text-kenzo-text transition-colors font-medium">
              Sign in
            </Link>
          </p>

          <div className="mt-8 flex justify-center gap-4 text-xs text-kenzo-text-dim">
            <Link href="#" className="hover:text-kenzo-text-muted transition-colors">Terms</Link>
            <Link href="#" className="hover:text-kenzo-text-muted transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
