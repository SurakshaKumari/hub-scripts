"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { scriptAPI, favoriteAPI } from '@/lib/api';
import ScriptCard from '@/components/ScriptCard';
import Link from 'next/link';

interface Script {
  id: string;
  title: string;
  description: string;
  game: string;
  category: string;
  isVerified?: boolean;
  isKeyless?: boolean;
  isBumped?: boolean;
  viewCount?: number;
  status: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'scripts' | 'favorites'>('scripts');
  const [scripts, setScripts] = useState<Script[]>([]);
  const [favorites, setFavorites] = useState<{ script: Script }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    
    const fetchTab = activeTab === 'scripts'
      ? scriptAPI.getMyScripts().then(r => setScripts(r.data))
      : favoriteAPI.getAll().then(r => setFavorites(r.data));

    fetchTab.catch(() => {}).finally(() => setLoading(false));
  }, [user, activeTab]);

  if (!user) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in to view your profile.</p>
          <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Header Profile Info */}
      <div className="bg-[#141414] border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-lg shadow-red-600/20">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white mb-1">{user.username}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">{user.email}</span>
                {user.role === 'admin' && (
                  <span className="bg-red-900/30 text-red-400 border border-red-700/50 px-2 py-0.5 rounded-full font-semibold text-xs">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab('scripts')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'scripts' ? 'text-white border-red-600' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            My Uploaded Scripts
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'favorites' ? 'text-white border-red-600' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            Favorites
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-[#141414] rounded-xl border border-gray-800 animate-pulse" />
            ))}
          </div>
        ) : activeTab === 'scripts' ? (
          scripts.length === 0 ? (
            <div className="text-center py-20 bg-[#141414] rounded-xl border border-gray-800">
              <p className="text-gray-500 mb-4">You haven&apos;t uploaded any scripts yet.</p>
              <Link href="/submit" className="text-red-500 hover:text-red-400 font-bold text-sm">
                Upload your first script →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scripts.map(script => (
                <div key={script.id} className="relative">
                  <ScriptCard {...script} author={user.username} />
                  {script.status === 'pending' && (
                    <div className="absolute top-2 right-2 z-10 bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded">
                      Pending Review
                    </div>
                  )}
                  {script.status === 'rejected' && (
                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Rejected
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          favorites.length === 0 ? (
            <div className="text-center py-20 bg-[#141414] rounded-xl border border-gray-800">
              <p className="text-gray-500 mb-4">You haven&apos;t saved any scripts to your favorites.</p>
              <Link href="/scripts" className="text-red-500 hover:text-red-400 font-bold text-sm">
                Browse scripts →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map(fav => (
                <ScriptCard key={fav.script.id} {...fav.script} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
