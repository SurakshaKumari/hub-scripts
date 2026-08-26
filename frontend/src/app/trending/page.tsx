"use client";

import { useEffect, useState } from 'react';
import { scriptAPI } from '@/lib/api';
import ScriptCard from '@/components/ScriptCard';

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

type SortMode = 'views' | 'votes' | 'newest';

export default function TrendingPage() {
  const [scripts, setScripts] = useState<TrendingScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterKeyless, setFilterKeyless] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);
  const [filterBumped, setFilterBumped] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('views');
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    scriptAPI.getTrending()
      .then(r => setScripts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Apply filters
  let displayed = scripts.filter(s => {
    if (filterKeyless && !s.isKeyless) return false;
    if (filterVerified && !s.isVerified) return false;
    if (filterBumped && !s.isBumped) return false;
    return true;
  });

  // Apply sort
  displayed = [...displayed].sort((a, b) => {
    let diff = 0;
    if (sortMode === 'views') diff = b.viewCount - a.viewCount;
    else if (sortMode === 'votes') diff = (b._count.votes) - (a._count.votes);
    return sortDesc ? diff : -diff;
  });

  const SORT_LABEL: Record<SortMode, string> = {
    views: 'Most Viewed',
    votes: 'Most Voted',
    newest: 'Newest',
  };

  return (
    <div className="min-h-screen bg-[#101012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">🔥 Trending Scripts</h1>
          </div>
          <p className="text-zinc-400 max-w-3xl">
            Browse the hottest Roblox scripts updated for 2026, featuring completely free, keyless and mobile-friendly options.
          </p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            {/* No Key filter */}
            <button
              onClick={() => setFilterKeyless(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filterKeyless
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-[#1a1a1c] hover:bg-[#252528] text-zinc-300 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-4l5.659-5.659C9.098 10.743 9 9.5 9 8a6 6 0 016-6z" /></svg>
              No Key
            </button>

            {/* Mobile Support filter */}
            <button
              onClick={() => setFilterBumped(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filterBumped
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-[#1a1a1c] hover:bg-[#252528] text-zinc-300 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Featured
            </button>

            {/* Verified filter */}
            <button
              onClick={() => setFilterVerified(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filterVerified
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-[#1a1a1c] hover:bg-[#252528] text-zinc-300 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Verified
            </button>

            {/* Sort mode cycles */}
            <button
              onClick={() => {
                const modes: SortMode[] = ['views', 'votes', 'newest'];
                const idx = modes.indexOf(sortMode);
                setSortMode(modes[(idx + 1) % modes.length]);
              }}
              className="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#252528] text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              🔀 {SORT_LABEL[sortMode]}
            </button>
          </div>

          {/* Sort direction toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortDesc(v => !v)}
              className="flex items-center gap-2 bg-[#1a1a1c] hover:bg-[#252528] text-zinc-300 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              {sortDesc ? 'Highest to Lowest' : 'Lowest to Highest'}
              <svg className={`w-4 h-4 transition-transform ${sortDesc ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <div className="text-zinc-500 text-sm">
            Showing <span className="text-zinc-300 font-semibold">{displayed.length}</span> script{displayed.length !== 1 ? 's' : ''}
            {(filterKeyless || filterVerified || filterBumped) && (
              <button
                onClick={() => { setFilterKeyless(false); setFilterVerified(false); setFilterBumped(false); }}
                className="ml-2 text-red-400 hover:text-red-300 underline text-xs"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-[#1a1a1c] rounded-xl border border-white/5 animate-pulse" />
            ))
          ) : displayed.length === 0 ? (
            <div className="col-span-4 text-center py-20 text-zinc-500">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-semibold">No scripts match your filters</p>
              <button
                onClick={() => { setFilterKeyless(false); setFilterVerified(false); setFilterBumped(false); }}
                className="mt-3 text-red-400 hover:text-red-300 text-sm underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            displayed.map(script => <ScriptCard key={script.id} {...script} />)
          )}
        </div>

      </div>
    </div>
  );
}
