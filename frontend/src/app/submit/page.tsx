"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { scriptAPI } from '@/lib/api';

const categories = ['RPG', 'FPS', 'Simulator', 'Roleplay', 'Action', 'Obby', 'Survival', 'Other'];

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    game: '',
    category: 'RPG',
    description: '',
    code: '',
    thumbnailUrl: '',
    isKeyless: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#141414] rounded-2xl border border-gray-800 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-5">🔒</div>
          <h2 className="text-2xl font-black text-white mb-3">Login Required</h2>
          <p className="text-gray-500 mb-8 text-sm">You need to be logged in to submit a script.</p>
          <div className="flex gap-3 justify-center">
            <a href="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
              Login
            </a>
            <a href="/register" className="bg-[#222] hover:bg-[#333] text-white border border-gray-700 px-6 py-3 rounded-xl font-bold transition-all">
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#141414] rounded-2xl border border-green-700/50 p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-5">✅</div>
          <h2 className="text-2xl font-black text-white mb-3">Script Submitted!</h2>
          <p className="text-gray-400 mb-2 text-sm">Your script has been submitted for review.</p>
          <p className="text-gray-500 text-sm mb-8">Our admin team will review it shortly. You&apos;ll be notified once it&apos;s approved.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/scripts')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
              Browse Scripts
            </button>
            <button onClick={() => { setSubmitted(false); setForm({ title: '', game: '', category: 'RPG', description: '', code: '', thumbnailUrl: '', isKeyless: false }); }} className="bg-[#222] hover:bg-[#333] text-white border border-gray-700 px-6 py-3 rounded-xl font-bold transition-all">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await scriptAPI.create(form);
      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to submit script');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white border-l-4 border-red-600 pl-3 mb-2">Submit a Script</h1>
          <p className="text-gray-500 text-sm">Share your script with the PROBESTHUB community.</p>
        </div>

        {/* Info notice */}
        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-yellow-500 text-lg flex-shrink-0">⚠️</span>
          <p className="text-yellow-400/80 text-sm">
            Scripts are reviewed by our admin team before going live. Malicious or harmful scripts will be rejected and may result in a ban.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
            <span className="text-red-500 text-lg">✕</span>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Script Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Blox Fruits Auto Farm v2"
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-red-600 focus:outline-none placeholder-gray-600 transition-colors"
            />
          </div>

          {/* Game + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Game <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.game}
                onChange={(e) => setForm({ ...form, game: e.target.value })}
                placeholder="e.g. Blox Fruits"
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-red-600 focus:outline-none placeholder-gray-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-red-600 focus:outline-none transition-colors"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what your script does, its features, and any requirements..."
              rows={4}
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-red-600 focus:outline-none placeholder-gray-600 resize-none transition-colors"
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Script Code <span className="text-red-500">*</span></label>
            <textarea
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="-- Paste your Luau script here..."
              rows={14}
              className="w-full bg-[#0d0d0d] border border-gray-700 text-green-400 font-mono rounded-xl px-4 py-3 text-sm focus:border-red-600 focus:outline-none placeholder-gray-700 resize-y transition-colors"
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Thumbnail URL <span className="text-gray-600">(optional)</span></label>
            <input
              type="url"
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              placeholder="https://example.com/image.png"
              className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-xl px-4 py-3 focus:border-red-600 focus:outline-none placeholder-gray-600 transition-colors"
            />
          </div>

          {/* Keyless toggle */}
          <div className="flex items-center gap-4 bg-[#141414] border border-gray-800 rounded-xl p-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, isKeyless: !form.isKeyless })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${form.isKeyless ? 'bg-blue-600' : 'bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isKeyless ? 'translate-x-6' : 'translate-x-1'}`}></span>
            </button>
            <div>
              <div className="text-white font-semibold text-sm">Keyless Script</div>
              <div className="text-gray-500 text-xs">Enable if your script does not require a key system</div>
            </div>
            {form.isKeyless && (
              <span className="ml-auto bg-blue-900/50 text-blue-400 border border-blue-700 text-xs px-2 py-0.5 rounded-full">🔓 Keyless</span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-red-600/20 hover:scale-[1.01]"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Submitting for Review...
              </span>
            ) : (
              '🚀 Submit for Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
