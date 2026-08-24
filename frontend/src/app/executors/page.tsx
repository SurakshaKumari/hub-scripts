"use client";

import { useEffect, useState } from 'react';
import { executorAPI } from '@/lib/api';

interface Executor {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  downloadUrl: string;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
}

function ExecutorCard({ executor }: { executor: Executor }) {
  return (
    <div className={`bg-[#141414] rounded-xl border transition-all duration-300 hover:border-red-600/40 flex flex-col overflow-hidden group relative ${
      executor.isFeatured ? 'border-red-600/30' : 'border-gray-800'
    }`}>
      {executor.isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">★ Featured</span>
        </div>
      )}

      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center overflow-hidden">
        {executor.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={executor.imageUrl} alt={executor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-[#2a2a2a] text-6xl font-black select-none">
            {executor.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-black text-lg group-hover:text-red-400 transition-colors">{executor.name}</h3>
            {executor.isVerified && (
              <span className="bg-green-900/30 text-green-400 border border-green-700/50 text-xs px-2 py-0.5 rounded-full">✓ Verified</span>
            )}
          </div>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{executor.description}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <a
            href={executor.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-red-600/20"
          >
            ⬇ Download
          </a>
          <div className="text-center text-gray-700 text-xs">
            Added {new Date(executor.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExecutorsPage() {
  const [executors, setExecutors] = useState<Executor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'featured'>('all');

  useEffect(() => {
    executorAPI.getAll()
      .then(r => setExecutors(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = executors.filter(e => {
    if (filter === 'verified') return e.isVerified;
    if (filter === 'featured') return e.isFeatured;
    return true;
  });

  // Sort: featured first, then verified, then rest
  const sorted = [...filtered].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    if (a.isVerified && !b.isVerified) return -1;
    if (!a.isVerified && b.isVerified) return 1;
    return 0;
  });

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-950/30 to-transparent border-b border-gray-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">⚙ Executors</h1>
          <p className="text-gray-500">Verified and safe Roblox script executors, hand-picked by our team</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Warning banner */}
        <div className="bg-yellow-900/15 border border-yellow-700/30 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-yellow-500 text-xl flex-shrink-0">⚠</span>
          <div>
            <p className="text-yellow-400 text-sm font-semibold mb-0.5">Use at your own risk</p>
            <p className="text-yellow-400/60 text-xs leading-relaxed">
              Always download executors from official sources. We verify these executors but using any third-party software with Roblox carries risk of account action.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'all', label: 'All Executors' },
            { key: 'verified', label: '✓ Verified Only' },
            { key: 'featured', label: '★ Featured' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as 'all' | 'verified' | 'featured')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-[#141414] text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden animate-pulse">
                <div className="h-40 bg-[#1a1a1a]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-[#222] rounded w-2/3" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-full" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-4/5" />
                  <div className="h-10 bg-[#222] rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚙️</div>
            <p className="text-gray-500 text-lg font-semibold">No executors found</p>
            <p className="text-gray-600 text-sm mt-1">Try a different filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.map(executor => (
              <ExecutorCard key={executor.id} executor={executor} />
            ))}
          </div>
        )}

        {/* Help section */}
        <div className="mt-16 bg-[#141414] border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-black text-white mb-4">How to use an Executor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Download Executor', desc: 'Choose a verified executor from the list above and download from the official site.' },
              { step: '02', title: 'Open Roblox', desc: 'Launch the Roblox game you want to use the script in and wait for it to fully load.' },
              { step: '03', title: 'Inject & Execute', desc: 'Open your executor, inject it into Roblox, paste the script code and click Execute.' },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="text-red-600 font-black text-2xl flex-shrink-0">{item.step}</div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
