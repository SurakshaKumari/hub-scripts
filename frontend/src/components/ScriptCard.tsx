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
  createdAt?: string;
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
  createdAt,
  author,
  _count,
}: ScriptCardProps) {
  const authorName = typeof author === 'string' ? author : author?.username ?? 'Unknown';

  const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <Link href={`/scripts/${id}`} className="group flex flex-col gap-2 transition-all h-full w-full">
      {/* ─── Thumbnail Image ─────────────────────────────────────────── */}
      <div className="relative aspect-[16/9] w-full bg-[#111] rounded-xl overflow-hidden shadow-sm">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1c]">
            <span className="text-5xl font-black text-white/5 select-none">{title.charAt(0).toUpperCase()}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          <div className="bg-black/60 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {formatNum(viewCount)}
          </div>
        </div>

        <div className="absolute top-2 right-2 z-10">
          <div className="bg-black/60 backdrop-blur-sm text-white/90 px-2 py-0.5 rounded-md text-[11px] font-semibold">
            {formatTimeAgo(createdAt)}
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1.5 z-10">
          {isBumped && (
            <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-md text-[11px] font-bold shadow-md">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Boosting
            </span>
          )}
          {isVerified && (
            <span className="inline-flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-md text-[11px] font-bold shadow-md">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* ─── Content Below Image ───────────────────────────────────────────── */}
      <div className="flex flex-col px-1">
        <h3 className="text-white font-bold text-sm leading-tight group-hover:text-red-400 transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{game}</p>
      </div>
    </Link>
  );
}
