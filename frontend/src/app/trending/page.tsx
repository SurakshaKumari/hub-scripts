"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { scriptAPI } from '@/lib/api';

interface TrendingScript {
  id: string;
  title: string;
  description: string;
  game: string;
  category: string;
  isVerified: boolean;
  isKeyless: boolean;
  isBumped: boolean;
  viewCount: number;
  thumbnailUrl?: string | null;
  author: { username: string };
  _count: { votes: number; comments: number };
}

const RANK_STYLES = [
  'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
  'text-gray-300 border-gray-500/50 bg-gray-500/10',
  'text-orange-400 border-orange-500/50 bg-orange-500/10',
];

export default function TrendingPage() {
  const [scripts, setScripts] = useState<TrendingScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    scriptAPI.getTrending()
      .then(r => setScripts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-950/40 to-transparent border-b border-gray-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-1.5 text-sm text-red-400 mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Updated hourly
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
            🔥 Trending Scripts
          </h1>
          <p className="text-gray-500">The hottest Roblox scripts ranked by views and engagement</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="space-y-3">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-[#141414] rounded-xl border border-gray-800 p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#222] rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#222] rounded w-1/2" />
                    <div className="h-3 bg-[#1a1a1a] rounded w-1/3" />
                  </div>
                  <div className="w-16 h-8 bg-[#222] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : scripts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-500 text-lg font-semibold">No trending data yet</p>
            <p className="text-gray-600 text-sm mt-1">Check back once scripts have been viewed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scripts.map((script, i) => (
              <Link
                key={script.id}
                href={`/scripts/${script.id}`}
                className={`flex items-center gap-4 bg-[#141414] border rounded-xl p-4 hover:border-red-600/40 transition-all group ${
                  i === 0 ? 'border-yellow-600/30 hover:border-yellow-500/50' : 'border-gray-800'
                }`}
              >
                {/* Rank */}
                <div className={`w-12 h-12 rounded-xl border flex-shrink-0 flex items-center justify-center font-black text-lg ${
                  i < 3 ? RANK_STYLES[i] : 'text-gray-600 border-gray-800 bg-[#1a1a1a]'
                }`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-red-500 font-semibold">{script.game}</span>
                    {script.isVerified && (
                      <span className="text-xs text-green-400 border border-green-700/50 px-1.5 py-0.5 rounded-full">✓</span>
                    )}
                    {script.isKeyless && (
                      <span className="text-xs text-blue-400 border border-blue-700/50 px-1.5 py-0.5 rounded-full">🔓</span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors truncate">
                    {script.title}
                  </h3>
                  <div className="text-gray-600 text-xs mt-0.5">by {script.author.username}</div>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <div className="flex items-center gap-1 text-sm font-bold text-white">
                    <span className="text-gray-600 text-xs">👁</span>
                    <span className={i === 0 ? 'text-yellow-400' : i < 3 ? 'text-gray-300' : 'text-gray-400'}>
                      {script.viewCount >= 1000 ? `${(script.viewCount / 1000).toFixed(1)}k` : script.viewCount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span>👍 {script._count.votes}</span>
                    <span>💬 {script._count.comments}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-700 group-hover:text-red-500 transition-colors text-lg flex-shrink-0">›</div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && scripts.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/scripts"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
            >
              Browse All Scripts →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
