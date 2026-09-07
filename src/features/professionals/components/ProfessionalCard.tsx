import { MapPin } from 'lucide-react';
import type { PublicProfessional } from '../types';
import { StarRatingDisplay } from './StarRatingDisplay';

type Props = {
  professional: PublicProfessional;
  onOpenProfile: () => void;
  onContact: () => void;
};

export function ProfessionalCard({ professional, onOpenProfile, onContact }: Props) {
  const avatar = professional.avatar;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-yachanga-border bg-yachanga-surface p-5 shadow-sm transition hover:border-yachanga-primary/30 hover:shadow-md">
      <button
        type="button"
        onClick={onOpenProfile}
        className="flex flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-yachanga-primary/40 focus-visible:ring-offset-2"
        aria-label={`Ver perfil de ${professional.nombre}`}
      >
        <div className="flex items-start gap-4">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full object-cover bg-yachanga-border"
              width={64}
              height={64}
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yachanga-primary/10 text-xl font-bold text-yachanga-primary"
              aria-hidden
            >
              {professional.nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-yachanga-text">{professional.nombre}</h3>
            <p className="mt-0.5 truncate text-sm font-semibold text-yachanga-primary">
              {professional.oficio}
            </p>
            <div className="mt-2">
              <StarRatingDisplay
                rating={professional.rating}
                reviewCount={professional.resenas_count}
              />
            </div>
            {professional.zona ? (
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-yachanga-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{professional.zona}</span>
              </p>
            ) : null}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onContact();
        }}
        className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-yachanga-primary px-4 text-sm font-semibold text-white transition hover:bg-yachanga-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yachanga-primary"
      >
        Contactar
      </button>
    </article>
  );
}
