import { useEffect, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { fetchPublicProfessionalDetail } from '../api';
import type { PublicProfessional, PublicProfessionalDetail } from '../types';
import { canShowWorkerReputation } from '../workerReputation';
import { StarRatingDisplay } from './StarRatingDisplay';

type Props = {
  professional: PublicProfessional | null;
  open: boolean;
  onClose: () => void;
  onContact: () => void;
};

function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ProfessionalProfileModal({ professional, open, onClose, onContact }: Props) {
  const [detail, setDetail] = useState<PublicProfessionalDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !professional) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void fetchPublicProfessionalDetail(professional.id).then((d) => {
      if (cancelled) return;
      setDetail(d);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [open, professional]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !professional) return null;

  const profile = detail?.profile ?? {
    ...professional,
    descripcion: '',
  };
  const avatar = profile.avatar;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-yachanga-surface shadow-xl sm:max-h-[85vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-yachanga-border px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover bg-yachanga-border"
                width={56}
                height={56}
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-yachanga-primary/10 text-lg font-bold text-yachanga-primary">
                {profile.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h2 id="profile-modal-title" className="truncate text-xl font-bold text-yachanga-text">
                {profile.nombre}
              </h2>
              <p className="truncate text-sm font-semibold text-yachanga-primary">{profile.oficio}</p>
              <div className="mt-1">
                <StarRatingDisplay
                  rating={profile.rating}
                  reviewCount={profile.resenas_count}
                  completedJobs={profile.total_jobs_done}
                />
              </div>
              {profile.zona ? (
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-yachanga-muted">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {profile.zona}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-yachanga-muted hover:bg-yachanga-bg hover:text-yachanga-text"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="space-y-3 animate-pulse" aria-busy="true">
              <div className="h-4 w-full rounded bg-yachanga-border" />
              <div className="h-4 w-4/5 rounded bg-yachanga-border" />
              <div className="h-20 w-full rounded-xl bg-yachanga-border" />
            </div>
          ) : (
            <>
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-yachanga-muted">
                  Sobre el profesional
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-yachanga-text">
                  {profile.descripcion?.trim() ||
                    'Este profesional todavía no cargó una descripción pública.'}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-yachanga-muted">
                  Habilidades
                </h3>
                {(detail?.habilidades?.length ?? 0) === 0 ? (
                  <p className="mt-2 text-sm text-yachanga-muted">Sin oficios publicados.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {detail!.habilidades.map((h) => (
                      <li
                        key={`${h.nombre}-${h.es_principal}`}
                        className="rounded-xl border border-yachanga-border bg-yachanga-bg/50 px-4 py-3"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-semibold text-yachanga-text">{h.nombre}</p>
                          {h.anos_experiencia != null && h.anos_experiencia > 0 ? (
                            <span className="text-xs font-medium text-yachanga-muted">
                              {h.anos_experiencia} año{h.anos_experiencia === 1 ? '' : 's'}
                            </span>
                          ) : null}
                        </div>
                        {h.descripcion ? (
                          <p className="mt-1 text-sm text-yachanga-muted">{h.descripcion}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wide text-yachanga-muted">
                  Reseñas
                </h3>
                {!canShowWorkerReputation(profile.total_jobs_done) ? (
                  <p className="mt-2 text-sm text-yachanga-muted">
                    Profesional nuevo: las reseñas se muestran al completar al menos 2 trabajos.
                  </p>
                ) : (detail?.resenas?.length ?? 0) === 0 ? (
                  <p className="mt-2 text-sm text-yachanga-muted">Todavía no hay reseñas escritas.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {detail!.resenas.map((r) => (
                      <li
                        key={r.id}
                        className="rounded-xl border border-yachanga-border px-4 py-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-yachanga-text">{r.cliente}</p>
                          <StarRatingDisplay rating={r.rating} showCount={false} />
                        </div>
                        {r.comentario ? (
                          <p className="mt-2 text-sm leading-relaxed text-yachanga-text">
                            {r.comentario}
                          </p>
                        ) : null}
                        {r.fecha ? (
                          <p className="mt-2 text-xs text-yachanga-muted">
                            {formatReviewDate(r.fecha)}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>

        <div className="border-t border-yachanga-border p-4">
          <button
            type="button"
            onClick={onContact}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-yachanga-primary px-4 text-base font-semibold text-white transition hover:bg-yachanga-primary-dark"
          >
            Contactar
          </button>
        </div>
      </div>
    </div>
  );
}
