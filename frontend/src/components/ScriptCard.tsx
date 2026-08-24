import Link from 'next/link';
import Image from 'next/image';

interface ScriptCardProps {
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
  author?: string | { username: string; avatar?: string };
  _count?: { votes?: number; comments?: number };
}

export default function ScriptCard({
  id,
  title,
  description,
  game,
  thumbnailUrl,
  isVerified,
  isBumped,
  isKeyless,
  viewCount = 0,
  author,
  _count,
}: ScriptCardProps) {
  const authorName = typeof author === 'string' ? author : author?.username ?? 'Unknown';

  const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className={`group relative premium-card rounded-3xl flex flex-col overflow-hidden h-full ${isBumped ? 'ring-1 ring-red-500/50 shadow-[0_0_20px_rgba(225,29,72,0.15)]' : ''}`}>
      
      {/* ─── Thumbnail ─────────────────────────────────────────── */}
      <div className="relative h-48 w-full bg-[#050505] overflow-hidden flex-shrink-0 border-b border-white/5">
        
        {/* Image / Placeholder */}
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
            <span className="text-8xl font-black text-white/[0.02] tracking-tighter select-none">{title.charAt(0).toUpperCase()}</span>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isBumped && (
            <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white border border-red-500/40 shadow-[0_0_10px_rgba(225,29,72,0.3)] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Bumped
            </span>
          )}
          {isVerified && (
            <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white border border-green-500/40 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
              <span className="text-green-400 text-[10px]">✓</span>
              Verified
            </span>
          )}
        </div>

        {/* Quick Stats Overlay (Views) */}
        <div className="absolute top-4 right-4 z-10">
          <div className="glass-panel px-2.5 py-1 rounded-full flex items-center gap-1.5 text-zinc-300 text-[10px] font-bold">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {formatNum(viewCount)}
          </div>
        </div>
      </div>

      {/* ─── Content ───────────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1 relative z-10">
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{game}</span>
          {isKeyless && (
            <span className="text-[10px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              KEYLESS
            </span>
          )}
        </div>

        <h3 className="text-white font-bold text-lg leading-tight mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-5">
          {description}
        </p>

        {/* Footer (Author & Stats) */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-zinc-400 text-xs font-medium truncate max-w-[80px]">{authorName}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
              {formatNum(_count?.votes ?? 0)}
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              {formatNum(_count?.comments ?? 0)}
            </div>
          </div>
        </div>

        {/* Hover Action Overlay */}
        <Link href={`/scripts/${id}`} className="absolute inset-0 z-20" aria-label={`View ${title}`} />
      </div>

    </div>
  );
}
