'use client'

import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
    if (error) console.error(error.message)
  }

  return (
    <div className="flex justify-center mt-40">
      <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded">
        Sign in with Google
      </button>
    </div>
  )
}
