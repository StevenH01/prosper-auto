"use client"
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { login, signup } from "./action";

// Initialize Supabase client
const supabase = createClient(
  'https://tbflqnzspldkshsvaebe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZmxxbnpzcGxka3Noc3ZhZWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNDgxNzEsImV4cCI6MjAzODYyNDE3MX0.fzYGK0h5w8ywvNanji3_58VjwU1YclC6y0q6zPhpUlM'
);

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) throw error;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

      if (profileError) throw profileError;

      const userRole = profile?.role || 'user';
      console.log('User Role: ', userRole);

      localStorage.setItem('userRole', userRole);
    }
    // if (error) {
    //   console.error("Error during Google login:", error);
    //   setError(error.message || "An unexpected error occurred.");
    // } else {
    //   // Handle successful login, if needed
    // }
  } catch (error) {
    // Handle any unexpected errors during the process
    console.error("Unexpected error:", error);
    // setError(error.message || "An unexpected error occurred.");
  }
};

  return (
    <div>
      <form className="grid justify-center items-center">
        <div className="flex justify-center p-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Google Login
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid items-center">
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div className="grid">
          <label htmlFor="password">Password:</label>
          <input id="password" name="password" type="password" required />
        </div>
        <div className="grid">
          <button formAction={login}>Log in</button>
          <button formAction={signup}>Sign up</button>
        </div>
      </form>
    </div>
  );
}
