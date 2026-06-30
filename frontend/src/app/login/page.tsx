'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user && !loading) {
      router.push(redirect);
    }
  }, [user, loading, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    const success = await login(email, password);
    setFormLoading(false);

    if (success) {
      router.push(redirect);
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas px-4 py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Go Back Link */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-orange-accent transition-all cursor-pointer mb-6 self-center max-w-md w-full">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Store</span>
      </Link>

      <div className="w-full max-w-md space-y-8 bg-surface-raised border border-border/40 p-8 rounded-cards shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="font-display text-3xl font-bold tracking-wider text-orange-accent">
            RIDEX
          </Link>
          <h2 className="mt-4 font-display text-xl font-bold text-text-primary uppercase tracking-wide">Sign In to Your Account</h2>
          <p className="mt-2 text-xs text-text-secondary">
            Access your orders, cart, and personalized AI sizing charts.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg text-xs">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-text-secondary">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rider@example.com"
              className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-text-secondary">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-surface-card border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-orange-accent"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-orange-accent text-white font-semibold rounded-lg hover:bg-orange-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-accent/15 mt-6"
            disabled={formLoading}
          >
            <LogIn className="h-4 w-4" />
            <span>{formLoading ? 'Verifying...' : 'Log In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-text-secondary pt-4 border-t border-border/20">
          Don&apos;t have a rider account?{' '}
          <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-orange-accent hover:underline font-semibold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="animate-spin h-8 w-8 border-2 border-orange-accent border-t-transparent rounded-full" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
