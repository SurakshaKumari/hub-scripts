"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ScriptCard from '@/components/ScriptCard';
import { scriptAPI } from '@/lib/api';

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          scriptAPI.getFeatured(),
          scriptAPI.getTrending(),
        ]);
        setFeatured(featuredRes.data.slice(0, 4));
        setTrending(trendingRes.data.slice(0, 4));
      } catch {
        // Fallback handled smoothly
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Spotlight Background */}
      <div className="spotlight-top" />

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        {/* Neon Pill */}
        <div className="fade-in-up inline-flex items-center gap-2 glass-panel rounded-full px-4 py-1.5 text-xs font-medium text-zinc-300 mb-8 border border-red-500/30 shadow-[0_0_20px_rgba(225,29,72,0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Daily updated scripts — Always undetected
        </div>

        {/* Headline */}
        <h1 className="fade-in-up delay-100 text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6">
          The <span className=" text-red-600">Premium</span> Hub
          <br />
          <span className="text-zinc-500">for Roblox Scripts.</span>
        </h1>

        {/* Subheadline */}
        <p className="fade-in-up delay-200 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Access an elite database of highly curated, safe, and undetected Roblox scripts. Dominate every game with zero compromises.
        </p>

        {/* Actions */}
        <div className="fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/scripts" className="btn-premium w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-2xl flex items-center justify-center gap-2 text-lg">
            Browse Scripts
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <Link href="/submit" className="glass-panel w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-zinc-200 hover:text-white hover:bg-white/5 transition-all text-lg border-white/10 shadow-lg">
            Upload Script
          </Link>
        </div>
      </section>

      {/* ─── Bento Grid Features ─────────────────────────────────── */}
      <section className="py-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">Engineered for <span className="gradient-text-red">Performance</span>.</h2>
          <p className="text-zinc-400 mt-2">Why 50,000+ top-tier players choose PROBESTHUB.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          
          {/* Bento Item 1 - Large Left */}
          <div className="md:col-span-2 md:row-span-2 premium-card rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 transition-transform group-hover:scale-150 duration-700" />
            <div className="absolute top-8 left-8 w-16 h-16 glass-panel rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Verified & Secure</h3>
              <p className="text-zinc-400 text-lg max-w-md">Every single script is manually reviewed and tested by our elite security team before it goes live.</p>
            </div>
          </div>

          {/* Bento Item 2 - Top Right */}
          <div className="premium-card rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden">
            <div className="absolute top-6 right-6 text-red-500/30">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">Zero Key System</h3>
              <p className="text-zinc-400 text-sm">Thousands of premium scripts available instantly, no keys required.</p>
            </div>
          </div>

          {/* Bento Item 3 - Bottom Right */}
          <div className="premium-card rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden bg-gradient-to-br from-red-950/40 to-black">
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-white mb-1">Daily</h3>
              <p className="text-red-400 font-semibold mb-2">Updates & Patches</p>
              <p className="text-zinc-400 text-sm">We ensure all scripts remain undetected through every Roblox update.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Featured Scripts ────────────────────────────────────── */}
      <section className="py-24 relative z-10 border-t border-white/5 bg-black/40">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Featured Selection</h2>
              <p className="text-zinc-500">Hand-picked by the PROBESTHUB curation team.</p>
            </div>
            <Link href="/scripts" className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 group">
              View Collection <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : featured.length > 0 ? (
              featured.map(script => <ScriptCard key={script.id} {...script} />)
            ) : (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
        </div>
      </section>

      {/* ─── Clean Stats Strip ───────────────────────────────────── */}
      <section className="border-y border-white/5 bg-black py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-around items-center gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {STATS.map(stat => (
              <div key={stat.label} className="w-full text-center pt-8 md:pt-0 first:pt-0">
                <div className="text-4xl md:text-5xl font-black gradient-text-premium mb-2">{stat.value}</div>
                <div className="text-zinc-500 text-sm font-semibold tracking-widest uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trending Scripts ────────────────────────────────────── */}
      <section className="py-24 relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
                Trending Now
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </h2>
              <p className="text-zinc-500">The most executed scripts across the platform this week.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            ) : trending.length > 0 ? (
              trending.map(script => <ScriptCard key={script.id} {...script} />)
            ) : (
              Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            )}
          </div>
        </div>
      </section>

      {/* ─── Executor CTA ────────────────────────────────────────── */}
      <section className="relative z-10 py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-black to-black" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Execute flawlessly.
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop dealing with crashes and bans. Access our curated list of premium and free executors guaranteed to work with every script on our platform.
          </p>
          <Link href="/executors" className="btn-premium inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-white text-lg shadow-[0_0_40px_rgba(225,29,72,0.3)]">
            Explore Executors
          </Link>
        </div>
      </section>
    </div>
  );
}
