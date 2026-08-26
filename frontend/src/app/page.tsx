"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScriptCard from '@/components/ScriptCard';
import { scriptAPI } from '@/lib/api';
import SearchModal from '@/components/SearchModal';

const STATS = [
  { value: '10k+', label: 'Verified Scripts' },
  { value: '50k+', label: 'Active Members' },
  { value: '100%', label: 'Free Access' },
];

function SkeletonCard() {
  return (
    <div className="premium-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-white/5 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-5 bg-white/10 rounded w-4/5" />
        <div className="h-4 bg-white/5 rounded w-full mt-4" />
        <div className="h-10 bg-white/5 rounded-xl mt-4" />
      </div>
    </div>
  );
}

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

export default function HomePage() {
  const [featured, setFeatured] = useState<Script[]>([]);
  const [trending, setTrending] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          scriptAPI.getFeatured(),
          scriptAPI.getTrending(),
        ]);
        setFeatured(featuredRes.data.slice(0, 8));
        setTrending(trendingRes.data.slice(0, 8));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#101012] text-white">
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Top Hero-like Section */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <h1 className="text-5xl font-black mb-10 flex items-center gap-1 tracking-tight">
            PROBEST<span className="text-red-600">HUB</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
            <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Trusted & Safe</h3>
              <p className="text-sm text-zinc-400">Active moderation team reviews scripts</p>
            </div>
            <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-zinc-700/50 text-zinc-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Advanced Search & Filters</h3>
              <p className="text-sm text-zinc-400">Find scripts by game and category</p>
            </div>
            <div className="bg-[#1a1a1c] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
              </div>
              <h3 className="text-lg font-bold mb-1">Totally Free Access</h3>
              <p className="text-sm text-zinc-400">Share scripts, comment and boost</p>
            </div>
          </div>

          <div className="w-full max-w-4xl">
            <div className="relative cursor-pointer" onClick={() => setSearchOpen(true)}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input type="text" readOnly className="w-full bg-[#1a1a1c] border border-white/5 rounded-xl pl-12 pr-12 py-4 text-white focus:outline-none focus:border-white/20 transition-colors cursor-pointer" placeholder="Search games, scripts, users..." />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="bg-white/10 text-zinc-400 rounded px-1.5 py-0.5 text-xs font-semibold">⌘K</div>
              </div>
            </div>
          </div>
        </div>

        {/* The newest scripts / Featured */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Latest</h2>
              <p className="text-zinc-400">The newest scripts added</p>
            </div>
            <Link href="/scripts" className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-[#1a1a1c] rounded-xl animate-pulse" />
              ))
            ) : featured.length > 0 ? (
              featured.map(script => <ScriptCard key={script.id} {...script} />)
            ) : (
              <div className="col-span-4 text-center py-10 text-gray-500">No scripts found.</div>
            )}
          </div>
        </section>

        {/* The hottest scripts / Trending */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Trending</h2>
              <p className="text-zinc-400">The hottest scripts</p>
            </div>
            <Link href="/trending" className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              View all
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-[#1a1a1c] rounded-xl animate-pulse" />
              ))
            ) : trending.length > 0 ? (
              trending.map(script => <ScriptCard key={script.id} {...script} />)
            ) : (
              <div className="col-span-4 text-center py-10 text-gray-500">No scripts found.</div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
