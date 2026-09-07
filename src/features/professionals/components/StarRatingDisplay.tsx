import { Star } from 'lucide-react';

type Props = {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
};

export function StarRatingDisplay({
  rating,
  reviewCount = 0,
  size = 'sm',
  showCount = true,
}: Props) {
  const safe = Math.max(0, Math.min(5, Number(rating) || 0));
  const iconClass = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  const textClass = size === 'md' ? 'text-sm' : 'text-xs';

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${textClass} text-yachanga-muted`}>
      <span className="inline-flex items-center gap-1 font-semibold text-yachanga-text">
        {safe.toFixed(1)}
        <Star className={`${iconClass} fill-amber-400 text-amber-400`} aria-hidden />
      </span>
      {showCount ? (
        <span>
          · {reviewCount} reseña{reviewCount === 1 ? '' : 's'}
        </span>
      ) : null}
    </div>
  );
}
