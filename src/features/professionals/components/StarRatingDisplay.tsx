import { Star } from 'lucide-react';
import { canShowWorkerReputation } from '../workerReputation';

type Props = {
  rating: number;
  reviewCount?: number;
  /** Trabajos finalizados: si &lt; 2, muestra badge "Nuevo" (igual que la app). */
  completedJobs?: number | null;
  size?: 'sm' | 'md';
  showCount?: boolean;
};

export function StarRatingDisplay({
  rating,
  reviewCount = 0,
  completedJobs,
  size = 'sm',
  showCount = true,
}: Props) {
  const textClass = size === 'md' ? 'text-sm' : 'text-xs';
  const iconClass = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  if (completedJobs != null && !canShowWorkerReputation(completedJobs)) {
    return (
      <span
        className={`inline-flex items-center rounded-md bg-indigo-100 px-2 py-0.5 font-semibold text-indigo-800 ${textClass}`}
      >
        Nuevo
      </span>
    );
  }

  const safe = Math.max(0, Math.min(5, Number(rating) || 0));

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
