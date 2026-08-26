"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { usePathname } from 'next/navigation';
import SearchModal from './SearchModal';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const unread = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/users/notifications').then(r => setNotifications(r.data)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const markAllRead = async () => {
    try {
      await api.put('/users/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/scripts', label: 'Browse' },
    { href: '/trending', label: 'Trending', hot: true },
    { href: '/executors', label: 'Executors' },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isHome = pathname === '/';
  if (isAuthPage) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-black/40 backdrop-blur-2xl border-b border-white/5'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-3 group mr-10">
                <div className="w-10 h-10 rounded-xl overflow-hidden transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                  <img src="/logo.png" alt="PROBESTHUB Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-bold text-lg tracking-widest text-zinc-100 uppercase">
                  PROBEST<span className="text-red-600">HUB</span>
                </span>
              </Link>

              {/* Desktop nav links */}
              <div className="hidden md:flex md:items-center space-x-1 border border-white/5 bg-white/[0.02] p-1 rounded-2xl backdrop-blur-md shadow-inner">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(link.href)
                        ? 'text-white bg-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.2)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {link.label}
                      {link.hot && <span className="flex w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop right side */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => setSearchOpen(true)} className="text-zinc-400 hover:text-white transition-colors" title="Search">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {user ? (
                <>
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => { setNotifOpen(!notifOpen); if (unread > 0 && !notifOpen) markAllRead(); }}
                      className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      {unread > 0 && (
                        <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,1)]" />
                      )}
                    </button>

                    {notifOpen && (
                      <div className="absolute right-0 mt-4 w-80 glass-panel rounded-2xl shadow-2xl z-50 opacity-0 animate-[fade-in-up_0.2s_ease_forwards]">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                          <span className="text-white font-semibold text-sm">Notifications</span>
                          {notifications.length > 0 && (
                            <button onClick={markAllRead} className="text-xs text-red-500 hover:text-red-400 transition-colors">Mark all read</button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto no-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="py-8 text-center text-zinc-500 text-sm">You're all caught up.</div>
                          ) : (
                            notifications.slice(0, 10).map(n => (
                              <div key={n.id} className={`px-5 py-4 border-b border-white/5 text-sm transition-colors hover:bg-white/5 ${!n.isRead ? 'bg-white/[0.03]' : ''}`}>
                                <p className={n.isRead ? 'text-zinc-400' : 'text-white'}>{n.message}</p>
                                <p className="text-zinc-600 text-xs mt-1.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {user.role === 'admin' && (
                    <Link href="/admin" className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all">
                      Admin
                    </Link>
                  )}

                  <div className="h-6 w-px bg-white/10" />

                  <Link href="/profile" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-xs font-bold text-white shadow-inner group-hover:ring-2 ring-red-500/50 transition-all">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  </Link>

                  <button onClick={logout} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-zinc-300 hover:text-white text-sm font-semibold transition-colors px-2">
                    Log in
                  </Link>
                  <Link href="/register" className="btn-premium text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileOpen(true)} className="p-2 text-zinc-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (simplified for brevity, keeping it ultra clean) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-full max-w-sm bg-[#050505] border-l border-white/5 h-full flex flex-col animate-[slideIn_0.3s_ease-out]">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <span className="font-bold tracking-widest text-white uppercase">PROBEST<span className="text-red-600">HUB</span></span>
              <button onClick={() => setMobileOpen(false)} className="text-zinc-500"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-lg font-medium text-zinc-300 hover:text-white">
                  {l.label}
                </Link>
              ))}
              <hr className="border-white/5 my-4" />
              {user ? (
                <>
                  <Link href="/profile" className="text-lg font-medium text-white">Profile</Link>
                  <button onClick={logout} className="text-lg font-medium text-red-500 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-lg font-medium text-white">Log in</Link>
                  <Link href="/register" className="text-lg font-medium text-red-500">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Spacer for all pages so content doesn't slide under fixed navbar */}
      <div className="h-20 pointer-events-none" aria-hidden="true" />
    </>
  );
}
