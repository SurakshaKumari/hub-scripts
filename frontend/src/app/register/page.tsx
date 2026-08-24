"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authAPI.register({ username, email, password });
      login(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, label: '', color: '', textColor: '' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const score = [password.length >= 6, password.length >= 10, hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    if (score <= 2) return { level: 1, label: 'Weak', color: 'bg-red-600', textColor: 'text-red-400' };
    if (score <= 3) return { level: 2, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
    if (score <= 4) return { level: 3, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-400' };
    return { level: 4, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400' };
  };

  const strength = getPasswordStrength();

  const confirmMatch = confirm.length > 0 && password === confirm;
  const confirmMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex">

      {/* ─── Left brand panel (desktop only) ─────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative overflow-hidden bg-[#0d0d0d] border-r border-gray-900 flex-col justify-between p-12">
        {/* Glow orbs */}
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-red-900/8 rounded-full blur-[80px] pointer-events-none" />
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

        {/* Benefits */}
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white leading-tight mb-6">
            Join the<br />
            <span className="gradient-text">Community</span>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
            Create a free account and unlock all features — upload scripts, vote, comment and more.
          </p>

          <div className="space-y-4">
            {[
              { icon: '📤', title: 'Submit Scripts', desc: 'Share your scripts with 50k+ players' },
              { icon: '⬆️', title: 'Vote & Comment', desc: 'Help the community find the best scripts' },
              { icon: '⭐', title: 'Favourites', desc: 'Save scripts to access them anytime' },
              { icon: '🔔', title: 'Notifications', desc: 'Get alerts on script updates and comments' },
            ].map(b => (
              <div key={b.title} className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center text-base flex-shrink-0 group-hover:bg-red-600/20 transition-colors mt-0.5">
                  {b.icon}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{b.title}</p>
                  <p className="text-gray-600 text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badges */}
        <div className="relative z-10 flex flex-wrap gap-2">
          {['Free forever', 'No key needed', 'Daily updates', 'Safe scripts'].map(b => (
            <span key={b} className="text-xs bg-red-600/10 border border-red-600/20 text-red-400 px-3 py-1 rounded-full">
              ✓ {b}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Right form panel ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/4 rounded-full blur-[80px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-900/4 rounded-full blur-[60px] pointer-events-none lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-red-600/30 group-hover:scale-110 transition-all overflow-hidden">
                <img src="/logo.png" alt="PROBESTHUB Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-2xl tracking-widest uppercase">
                PROBEST<span className="text-red-600">HUB</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-white mb-2">Create your account</h1>
            <p className="text-gray-500 text-sm">Join 50,000+ Roblox scripters — free forever.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl px-4 py-3 mb-5 flex items-center gap-2 scale-in">
              <span className="text-red-500 text-base flex-shrink-0">✕</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={30}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="coolscripter99"
                className="w-full bg-[#141414] border border-gray-800 hover:border-gray-700 focus:border-red-600 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none placeholder-gray-700 transition-all focus:shadow-lg focus:shadow-red-600/10"
              />
              {username.length > 0 && username.length < 3 && (
                <p className="text-xs text-yellow-500 mt-1">Minimum 3 characters</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#141414] border border-gray-800 hover:border-gray-700 focus:border-red-600 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none placeholder-gray-700 transition-all focus:shadow-lg focus:shadow-red-600/10"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map(lvl => (
                      <div
                        key={lvl}
                        className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                          strength.level >= lvl ? strength.color : 'bg-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-medium ${strength.textColor}`}>{strength.label}</p>
                    {strength.level < 3 && (
                      <p className="text-xs text-gray-700">Add uppercase, numbers & symbols</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full bg-[#141414] border text-white rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none placeholder-gray-700 transition-all ${
                    confirmMismatch
                      ? 'border-red-700 focus:border-red-500'
                      : confirmMatch
                        ? 'border-green-700 focus:border-green-500'
                        : 'border-gray-800 hover:border-gray-700 focus:border-red-600'
                  }`}
                />
                {confirm.length > 0 && (
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${confirmMatch ? 'text-green-500' : 'text-red-500'}`}>
                    {confirmMatch ? '✓' : '✕'}
                  </span>
                )}
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                  agreed ? 'bg-red-600 border-red-600' : 'border-gray-700 group-hover:border-gray-500 bg-[#141414]'
                }`}
              >
                {agreed && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">
                By creating an account you agree to our{' '}
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors underline underline-offset-2">Terms of Service</span>{' '}
                and{' '}
                <span className="text-gray-400 hover:text-white cursor-pointer transition-colors underline underline-offset-2">Privacy Policy</span>.
              </p>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-sm transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-95 mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Free Account →'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-red-500 hover:text-red-400 font-bold transition-colors">
                Sign in →
              </Link>
            </p>
            <Link href="/scripts" className="block text-gray-700 hover:text-gray-500 text-xs transition-colors">
              ← Browse scripts without an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
