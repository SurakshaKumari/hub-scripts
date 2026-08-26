"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { scriptAPI } from '@/lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrendingScript {
  id: string;
  title: string;
  game: string;
  viewCount: number;
  thumbnailUrl?: string | null;
  isKeyless: boolean;
  isVerified: boolean;
  author: { username: string } | string;
  _count?: { votes: number };
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [trendingScripts, setTrendingScripts] = useState<TrendingScript[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll + fetch trending scripts when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setQuery('');
      setResults([]);
      setTrendingLoading(true);
      scriptAPI.getTrending()
        .then(r => setTrendingScripts((r.data || []).slice(0, 6)))
        .catch(() => {})
        .finally(() => setTrendingLoading(false));
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Debounced script search
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await scriptAPI.getAll({ search: query, limit: 6 });
        setResults(data.scripts || []);
      } catch {
        // silence
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/scripts?q=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  // Shared script row renderer
  const ScriptRow = ({ script, rank }: { script: any; rank?: number }) => (
    <button
      key={script.id}
      onClick={() => { router.push(`/scripts/${script.id}`); onClose(); }}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group text-left border-b border-white/5 last:border-0"
    >
      {/* Rank badge (trending only) */}
      {rank !== undefined && (
        <span className={`flex-shrink-0 w-6 text-center text-xs font-black ${
          rank === 0 ? 'text-yellow-400' : rank === 1 ? 'text-zinc-400' : rank === 2 ? 'text-orange-400' : 'text-zinc-600'
        }`}>
          {rank + 1}
        </span>
      )}

      {/* Thumbnail */}
      <div className="relative w-16 h-10 bg-[#050505] rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
        {script.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={script.thumbnailUrl} alt={script.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-black text-lg">
            {script.title?.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-white font-bold text-sm group-hover:text-red-400 transition-colors truncate">
          {script.title}
        </span>
        <span className="text-zinc-500 text-xs truncate">{script.game}</span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-zinc-600 font-semibold flex-shrink-0">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {script.viewCount >= 1000 ? `${(script.viewCount / 1000).toFixed(1)}k` : script.viewCount}
        </span>
        <span>👍 {script._count?.votes || 0}</span>
        {script.isKeyless && <span className="text-green-500 text-[10px] font-bold">NO KEY</span>}
      </div>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-0">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-[#141416] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-[fade-in-up_0.2s_ease_forwards]">

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 py-4 border-b border-white/5 bg-[#1a1a1c]">
          <svg className="w-5 h-5 text-zinc-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-zinc-500"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" onClick={onClose} className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/10 transition-colors ml-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
          {query.trim().length < 2 ? (
            /* ── Default: Trending Scripts ── */
            <div>
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <span className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
                  <span className="text-red-500">🔥</span> Trending Scripts
                </span>
                <button
                  onClick={() => { router.push('/trending'); onClose(); }}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors font-semibold"
                >
                  View all →
                </button>
              </div>

              {trendingLoading ? (
                <div className="px-4 pb-4 space-y-1">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                      <div className="w-6 h-3 bg-white/5 rounded flex-shrink-0" />
                      <div className="w-16 h-10 bg-white/5 rounded-lg flex-shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3 bg-white/5 rounded w-2/3" />
                        <div className="h-2.5 bg-white/5 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : trendingScripts.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-sm">No trending scripts yet</div>
              ) : (
                <div className="px-2 pb-3">
                  {trendingScripts.map((script, i) => (
                    <ScriptRow key={script.id} script={script} rank={i} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Search Results ── */
            <div className="py-2">
              <div className="px-4 py-2 flex items-center gap-2 text-xs font-bold text-zinc-500 tracking-wider">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                SCRIPTS
              </div>
              {loading ? (
                <div className="px-4 pb-4 space-y-1">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                      <div className="w-16 h-10 bg-white/5 rounded-lg flex-shrink-0" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-3 bg-white/5 rounded w-2/3" />
                        <div className="h-2.5 bg-white/5 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="px-2">
                  {results.map(script => <ScriptRow key={script.id} script={script} />)}
                </div>
              ) : (
                <div className="px-4 py-10 text-center text-zinc-500 text-sm">
                  No scripts found for &quot;{query}&quot;
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

