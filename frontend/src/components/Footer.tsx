import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const explore = [
    { href: '/scripts', label: 'Browse Scripts' },
    { href: '/trending', label: 'Trending' },
    { href: '/executors', label: 'Executors' },
  ];

  const account = [
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Register' },
    { href: '/profile', label: 'My Profile' },
  ];

  const community = [
    { href: 'https://discord.gg/probesthub', label: 'Discord Server' },
    { href: 'https://twitter.com/probesthub', label: 'Twitter / X' },
    { href: 'https://github.com/probesthub', label: 'GitHub' },
  ];

  return (
    <footer className="bg-black border-t border-white/5 relative overflow-hidden pt-20 pb-10 z-10">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Spans 2) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                <img src="/logo.png" alt="PROBESTHUB Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-black text-2xl tracking-widest uppercase text-white">
                PROBEST<span className="text-red-600">HUB</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6">
              The premier destination for high-quality, verified, and undetected Roblox scripts. Engineered for performance.
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-zinc-500 text-xs font-semibold tracking-wide uppercase">Systems Operational</span>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Explore</h3>
            <ul className="space-y-4">
              {explore.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-zinc-400 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Account</h3>
            <ul className="space-y-4">
              {account.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-zinc-400 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 text-sm tracking-widest uppercase">Community</h3>
            <ul className="space-y-4">
              {community.map(item => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group">
                    {item.label}
                    <svg className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {currentYear} PROBESTHUB. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-zinc-600">
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
