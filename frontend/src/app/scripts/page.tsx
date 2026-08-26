"use client";

import { useState, useEffect, useCallback } from 'react';
import ScriptCard from '@/components/ScriptCard';
import SearchBar from '@/components/SearchBar';
import { scriptAPI } from '@/lib/api';

const categories = ['All', 'RPG', 'FPS', 'Simulator', 'Roleplay', 'Action', 'Obby', 'Survival', 'General', 'Other'];
const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Most Viewed', value: 'popular' },
  { label: 'Most Voted', value: 'votes' },
];

interface Script {
  id: string;
  title: string;
  description: string;
  game: string;
  category: string;
  thumbnailUrl?: string | null;
  isVerified?: boolean;
  isBumped?: boolean;
  isKeyless?: boolean;
  viewCount?: number;
  author?: { username: string; avatar?: string };
  _count?: { votes: number; comments: number };
}

function SkeletonCard() {
  return (
    <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden animate-pulse">
      <div className="h-32 w-full bg-[#050505] border-b border-white/5" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-2 bg-[#222] rounded w-1/3" />
          <div className="h-2 bg-[#222] rounded w-1/4" />
        </div>
        <div className="h-3 bg-[#222] rounded w-full" />
        <div className="h-3 bg-[#222] rounded w-4/5" />
        <div className="flex justify-between pt-2">
          <div className="h-2 bg-[#222] rounded w-1/4" />
          <div className="h-2 bg-[#222] rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [keylessOnly, setKeylessOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchScripts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean> = {
        page,
        limit: 12,
        sort: selectedSort,
      };
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedGame) params.game = selectedGame;
      if (keylessOnly) params.keyless = true;

      const { data } = await scriptAPI.getAll(params);
      setScripts(data.scripts || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setScripts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, selectedGame, selectedSort, keylessOnly]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedGame('');
    setSelectedSort('newest');
    setKeylessOnly(false);
    setSearch('');
    setPage(1);
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white border-l-4 border-red-600 pl-3 mb-1">Browse Scripts</h1>
          <p className="text-gray-600 text-sm pl-4">
            {loading ? 'Loading...' : `${total.toLocaleString()} scripts available`}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Main content */}
          <div className="w-full">
            <div className="mb-8">
              <SearchBar onSearch={(q) => { setSearch(q); setPage(1); }} placeholder="Search scripts or games..." />
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : scripts.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-gray-500">No scripts found</p>
                <p className="text-sm mt-1">Try adjusting your search query</p>
                <button onClick={resetFilters} className="mt-4 text-red-500 hover:text-red-400 text-sm transition-colors">
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {scripts.map((script) => (
                  <ScriptCard key={script.id} {...script} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-red-900/30">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-black/50 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-red-900/50 px-5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                    let pageNum = i + 1;
                    if (pages > 7) {
                      if (page > 4) pageNum = page - 3 + i;
                      if (page > pages - 3) pageNum = pages - 6 + i;
                    }
                    return (
                      <button
                         key={pageNum}
                         onClick={() => setPage(pageNum)}
                         className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                           page === pageNum ? 'bg-red-700 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-black/50 text-gray-400 hover:bg-black/80 border border-red-900/50'
                         }`}
                       >
                         {pageNum}
                       </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="bg-black/50 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed text-white border border-red-900/50 px-5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
