"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

const TESTIMONIALS = [
  { text: 'Best script hub out there. Always updated, always working.', user: 'xBloxMaster' },
  { text: 'Found every script I needed in minutes. The community is 🔥', user: 'ScriptKid99' },
  { text: 'Keyless scripts everywhere. No annoying ad links. 10/10', user: 'ProFarmer' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIdx] = useState(() => Math.floor(Math.random() * TESTIMONIALS.length));
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      login(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const testimonial = TESTIMONIALS[testimonialIdx];

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex">

      {/* ─── Left brand panel (desktop only) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative overflow-hidden bg-[#0d0d0d] border-r border-gray-900 flex-col justify-between p-12">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-60 h-60 bg-red-900/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 scanline-grid opacity-50 pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative z-10">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-red-600/30 group-hover:scale-110 transition-all glow-pulse overflow-hidden">
            <img src="/logo.png" alt="PROBESTHUB Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-2xl tracking-widest uppercase">
            PROBEST<span className="text-red-600">HUB</span>
          </span>
        </Link>

        {/* Hero text */}
        <div className="relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-3 py-1 text-xs text-red-400 mb-6">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Trusted by 50,000+ scripters
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              The #1 place for<br />
              <span className="gradient-text">Roblox Scripts</span>
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Access thousands of verified, keyless scripts for every game. Free forever, updated daily.
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-3 mb-10">
            {[
              { icon: '🛡️', text: 'Verified & safe scripts' },
              { icon: '⚡', text: 'Updated daily — always undetected' },
              { icon: '🔓', text: 'Thousands of keyless scripts' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-gray-400 text-sm">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-[#141414] border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm italic leading-relaxed mb-3">&ldquo;{testimonial.text}&rdquo;</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                {testimonial.user.charAt(0)}
              </div>
              <span className="text-gray-600 text-xs font-medium">@{testimonial.user}</span>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xs">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '10k+', label: 'Scripts' },
            { value: '50k+', label: 'Members' },
            { value: 'Daily', label: 'Updates' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-red-500 font-black text-lg">{s.value}</p>
              <p className="text-gray-700 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right form panel ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Subtle bg effects for mobile */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/4 rounded-full blur-[80px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-900/4 rounded-full blur-[60px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-red-600/30 transition-all group-hover:scale-110 overflow-hidden">
                <img src="/logo.png" alt="PROBESTHUB Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-2xl tracking-widest uppercase">
                PROBEST<span className="text-red-600">HUB</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to access your scripts, favourites and profile.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl px-4 py-3 mb-6 flex items-center gap-2 scale-in">
              <span className="text-red-500 text-base flex-shrink-0">✕</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#141414] border border-gray-800 hover:border-gray-700 focus:border-red-600 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none placeholder-gray-700 transition-all focus:shadow-lg focus:shadow-red-600/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-300">Password</label>
                <span className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">Forgot password?</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#141414] border border-gray-800 hover:border-gray-700 focus:border-red-600 text-white rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none placeholder-gray-700 transition-all focus:shadow-lg focus:shadow-red-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors text-sm px-1"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-sm transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-95 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-700 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Links */}
          <div className="space-y-3 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-red-500 hover:text-red-400 font-bold transition-colors">
                Sign up free →
              </Link>
            </p>
            <Link href="/scripts" className="block text-gray-700 hover:text-gray-500 text-xs transition-colors">
              ← Continue browsing without an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
