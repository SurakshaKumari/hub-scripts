"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { scriptAPI, commentAPI, voteAPI, favoriteAPI } from '@/lib/api';

interface Script {
  id: string;
  title: string;
  description: string;
  code: string;
  game: string;
  category: string;
  isVerified: boolean;
  isKeyless: boolean;
  isBumped: boolean;
  viewCount: number;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  author: { id: string; username: string; avatar?: string };
  votes: { type: string; userId: string }[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { username: string; avatar?: string };
}

function SkeletonDetail() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-[#1a1a1a] rounded w-1/4 mb-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-5">
          <div className="h-8 bg-[#1a1a1a] rounded w-3/4" />
          <div className="h-40 bg-[#141414] rounded-xl" />
          <div className="h-64 bg-[#141414] rounded-xl" />
        </div>
        <div className="lg:w-80 space-y-4">
          <div className="h-40 bg-[#141414] rounded-xl" />
          <div className="h-32 bg-[#141414] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ScriptDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [script, setScript] = useState<Script | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null);
  const [voteCount, setVoteCount] = useState({ up: 0, down: 0 });
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  const fetchScript = useCallback(async () => {
    try {
      const { data } = await scriptAPI.getById(id);
      setScript(data);
      setVoteCount({ up: data.upvotes || 0, down: data.downvotes || 0 });
      if (user) {
        const myVote = data.votes?.find((v: { userId: string; type: string }) => v.userId === user._id);
        setUserVote(myVote ? myVote.type : null);
      }
    } catch {
      setError('Script not found');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await commentAPI.getAll(id);
      setComments(data);
    } catch {}
  }, [id]);

  const checkFavorite = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await favoriteAPI.getAll();
      const fav = data.find((f: { script: { id: string } }) => f.script.id === id);
      setIsFavorited(!!fav);
    } catch {}
  }, [id, user]);

  useEffect(() => {
    fetchScript();
    fetchComments();
    checkFavorite();
  }, [fetchScript, fetchComments, checkFavorite]);

  const handleCopy = () => {
    if (!script) return;
    navigator.clipboard.writeText(script.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = async (type: 'UP' | 'DOWN') => {
    if (!user) return;
    try {
      const { data } = await voteAPI.vote(id, type);
      setVoteCount({ up: data.upvotes, down: data.downvotes });
      setUserVote(prev => prev === type ? null : type);
    } catch {}
  };

  const handleFavorite = async () => {
    if (!user || favLoading) return;
    setFavLoading(true);
    try {
      const { data } = await favoriteAPI.toggle(id);
      setIsFavorited(data.isFavorited);
    } catch {}
    setFavLoading(false);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || commenting) return;
    setCommenting(true);
    try {
      const { data } = await commentAPI.add(id, comment.trim());
      setComments(prev => [data, ...prev]);
      setComment('');
    } catch {}
    setCommenting(false);
  };

  if (loading) return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><SkeletonDetail /></div>
    </div>
  );

  if (error || !script) return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-2xl font-black text-white mb-2">Script Not Found</h2>
        <p className="text-gray-500 mb-6">This script may have been removed or doesn&apos;t exist.</p>
        <Link href="/scripts" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
          Browse Scripts
        </Link>
      </div>
    </div>
  );

  const codeLines = script.code.split('\n');
  const shouldCollapse = codeLines.length > 30;
  const displayCode = shouldCollapse && !expanded ? codeLines.slice(0, 30).join('\n') + '\n...' : script.code;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-700 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/scripts" className="hover:text-gray-400 transition-colors">Scripts</Link>
          <span>›</span>
          <span className="text-gray-400 truncate max-w-xs">{script.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-red-600/20 text-red-400 border border-red-700/50 text-xs px-2.5 py-1 rounded-full font-medium">
                  {script.game}
                </span>
                <span className="bg-[#1a1a1a] text-gray-400 border border-gray-700 text-xs px-2.5 py-1 rounded-full">
                  {script.category}
                </span>
                {script.isVerified && (
                  <span className="bg-green-900/30 text-green-400 border border-green-700/50 text-xs px-2.5 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
                {script.isKeyless && (
                  <span className="bg-blue-900/30 text-blue-400 border border-blue-700/50 text-xs px-2.5 py-1 rounded-full">
                    🔓 Keyless
                  </span>
                )}
                {script.isBumped && (
                  <span className="bg-red-900/30 text-red-400 border border-red-600/50 text-xs px-2.5 py-1 rounded-full bump-pulse">
                    🔥 Bumped
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{script.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>👤 <span className="text-gray-400">{script.author.username}</span></span>
                <span>📅 {new Date(script.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span>👁 {script.viewCount.toLocaleString()} views</span>
                <span>💬 {comments.length} comments</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-5 mb-5">
              <h2 className="text-white font-bold mb-3 text-xs uppercase tracking-widest text-gray-500">Description</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{script.description}</p>
            </div>

            {/* Code Block */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden mb-6">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#0d0d0d]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-gray-600 text-xs font-mono">script.lua</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    copied
                      ? 'bg-green-600/20 text-green-400 border border-green-700'
                      : 'bg-[#1a1a1a] hover:bg-[#222] text-gray-300 border border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy Code'}
                </button>
              </div>
              <div className="relative">
                <pre className="bg-[#0d0d0d] font-mono text-sm text-green-400 p-5 leading-relaxed overflow-x-auto" style={{ maxHeight: expanded ? 'none' : '400px', overflow: expanded ? 'auto' : 'hidden' }}>
                  <code>{displayCode}</code>
                </pre>
                {shouldCollapse && !expanded && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d0d0d] to-transparent h-20 flex items-end justify-center pb-3">
                    <button
                      onClick={() => setExpanded(true)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-1.5 rounded-lg font-bold transition-all"
                    >
                      Show Full Code ({codeLines.length} lines)
                    </button>
                  </div>
                )}
                {expanded && (
                  <div className="flex justify-center py-2 bg-[#0d0d0d] border-t border-gray-800">
                    <button onClick={() => setExpanded(false)} className="text-gray-500 hover:text-white text-xs transition-colors">
                      ↑ Collapse code
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <h2 className="text-xl font-black border-l-4 border-red-600 pl-3 mb-6">
                Comments <span className="text-gray-600 font-normal text-base">({comments.length})</span>
              </h2>

              {user ? (
                <form onSubmit={handleComment} className="mb-8">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this script..."
                    rows={3}
                    className="w-full bg-[#141414] border border-gray-800 hover:border-gray-700 focus:border-red-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none placeholder-gray-600 resize-none mb-3 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={commenting || !comment.trim()}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all"
                  >
                    {commenting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Posting...
                      </span>
                    ) : 'Post Comment'}
                  </button>
                </form>
              ) : (
                <div className="bg-[#141414] border border-gray-800 rounded-xl p-4 mb-8 text-center">
                  <p className="text-gray-500 text-sm">
                    <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold">Login</Link> to leave a comment
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-10 text-gray-700">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="text-sm">No comments yet. Be the first!</p>
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="bg-[#141414] rounded-xl border border-gray-800 hover:border-gray-700 p-4 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                          {c.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-white font-bold text-sm">{c.user.username}</span>
                          <span className="text-gray-600 text-xs ml-2">
                            {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed ml-11">{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">
            {/* Vote box */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-5">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Rate Script</h3>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => handleVote('UP')}
                  disabled={!user}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    userVote === 'UP'
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                      : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:border-green-700 hover:text-green-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  👍 {voteCount.up}
                </button>
                <button
                  onClick={() => handleVote('DOWN')}
                  disabled={!user}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                    userVote === 'DOWN'
                      ? 'bg-red-700 text-white shadow-lg shadow-red-700/20'
                      : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:border-red-800 hover:text-red-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  👎 {voteCount.down}
                </button>
              </div>
              {!user && <p className="text-gray-600 text-xs text-center"><Link href="/login" className="text-red-500">Login</Link> to vote</p>}
            </div>

            {/* Favorite button */}
            <button
              onClick={handleFavorite}
              disabled={!user || favLoading}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFavorited
                  ? 'bg-yellow-600/20 border border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/30'
                  : 'bg-[#141414] border border-gray-800 hover:border-yellow-600/50 text-gray-400 hover:text-yellow-400'
              }`}
            >
              {isFavorited ? '★ Saved to Favorites' : '☆ Save to Favorites'}
            </button>

            {/* Copy button (big) */}
            <button
              onClick={handleCopy}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                copied ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20'
              }`}
            >
              {copied ? '✓ Code Copied!' : '📋 Copy Script'}
            </button>

            {/* Author card */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-5">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Author</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-600/20">
                  {script.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-bold">{script.author.username}</div>
                  <div className="text-gray-600 text-xs mt-0.5">Script Author</div>
                </div>
              </div>
              <Link
                href={`/user/${script.author.username}`}
                className="mt-4 block text-center text-xs text-gray-500 hover:text-white border border-gray-800 hover:border-gray-600 py-2 rounded-lg transition-all"
              >
                View Profile
              </Link>
            </div>

            {/* Script Info */}
            <div className="bg-[#141414] rounded-xl border border-gray-800 p-5">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Info</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Game', value: script.game },
                  { label: 'Category', value: script.category },
                  { label: 'Views', value: script.viewCount.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-gray-600 text-xs">{label}</span>
                    <span className="text-white text-xs font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Keyless</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    script.isKeyless ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-gray-800 text-gray-600'
                  }`}>
                    {script.isKeyless ? '🔓 Yes' : '🔒 No'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Verified</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    script.isVerified ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-gray-800 text-gray-600'
                  }`}>
                    {script.isVerified ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
