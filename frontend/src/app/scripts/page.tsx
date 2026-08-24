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
    <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden animate-pulse">
      <div className="h-36 bg-[#1a1a1a]" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-[#222] rounded w-1/3" />
        <div className="h-4 bg-[#222] rounded w-4/5" />
        <div className="h-3 bg-[#222] rounded w-full" />
        <div className="h-8 bg-[#1a1a1a] rounded-lg mt-2" />
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

        <div className="flex gap-6">
          {/* Mobile filter button */}
          <button
            className="md:hidden fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-red-600/30 transition-all"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          </button>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-40 bg-black/70" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          <aside className={`${
            sidebarOpen
              ? 'fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#0a0a0a] overflow-y-auto p-6 border-r border-gray-800 slide-in'
              : 'hidden'
          } md:static md:block md:w-64 flex-shrink-0`}>
            {sidebarOpen && (
              <div className="flex items-center justify-between mb-6 md:hidden">
                <h3 className="text-white font-bold">Filters</h3>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white p-1">
                  ✕
                </button>
              </div>
            )}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-5 space-y-6 sticky top-20">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest">Filters</h3>

              {/* Category */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Game search */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Game</label>
                <input
                  type="text"
                  value={selectedGame}
                  onChange={(e) => { setSelectedGame(e.target.value); setPage(1); }}
                  placeholder="Filter by game..."
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none placeholder-gray-600"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Sort By</label>
                <select
                  value={selectedSort}
                  onChange={(e) => { setSelectedSort(e.target.value); setPage(1); }}
                  className="w-full bg-[#1a1a1a] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none"
                >
                  {sortOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>

              {/* Keyless only */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setKeylessOnly(!keylessOnly); setPage(1); }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    keylessOnly ? 'bg-red-600' : 'bg-gray-700'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    keylessOnly ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                <label className="text-gray-300 text-sm cursor-pointer" onClick={() => { setKeylessOnly(!keylessOnly); setPage(1); }}>
                  Keyless Only
                </label>
              </div>

              {/* Reset */}
              <button
                onClick={resetFilters}
                className="w-full text-sm text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600 py-2 rounded-lg transition-all"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <SearchBar onSearch={(q) => { setSearch(q); setPage(1); }} placeholder="Search scripts or games..." />
            </div>

            {/* Category pills (mobile friendly) */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin mb-5">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setPage(1); }}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : scripts.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-semibold text-gray-500">No scripts found</p>
                <p className="text-sm mt-1">Try adjusting your filters or search query</p>
                <button onClick={resetFilters} className="mt-4 text-red-500 hover:text-red-400 text-sm transition-colors">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scripts.map((script) => (
                  <ScriptCard key={script.id} {...script} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-900">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-[#141414] hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed text-white border border-gray-800 hover:border-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition-all"
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
                          page === pageNum ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-[#141414] text-gray-500 hover:bg-[#1a1a1a] border border-gray-800'
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
                  className="bg-[#141414] hover:bg-[#1a1a1a] disabled:opacity-30 disabled:cursor-not-allowed text-white border border-gray-800 hover:border-gray-600 px-5 py-2 rounded-lg text-sm font-medium transition-all"
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
