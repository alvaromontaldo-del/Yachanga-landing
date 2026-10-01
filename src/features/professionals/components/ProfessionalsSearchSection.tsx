import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, SearchX } from 'lucide-react';
import { listPublicCategories, searchPublicProfessionals } from '../api';
import { useDebouncedValue } from '../hooks';
import type { PublicProfessional } from '../types';
import { ContactDownloadModal } from './ContactDownloadModal';
import { ProfessionalCard } from './ProfessionalCard';
import { ProfessionalsGridSkeleton } from './ProfessionalCardSkeleton';
import { ProfessionalProfileModal } from './ProfessionalProfileModal';
import { ProfessionalsSearchBar } from './ProfessionalsSearchBar';

export function ProfessionalsSearchSection() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [zona, setZona] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [retryToken, setRetryToken] = useState(0);
  const [snapshot, setSnapshot] = useState<{
    key: string;
    error: boolean;
    professionals: PublicProfessional[];
  } | null>(null);
  const [profileTarget, setProfileTarget] = useState<PublicProfessional | null>(null);
  const [contactTarget, setContactTarget] = useState<PublicProfessional | null>(null);

  const debouncedQuery = useDebouncedValue(query, 350);
  const debouncedZona = useDebouncedValue(zona, 350);
  const hasFilters = Boolean(query.trim() || category.trim() || zona.trim());
  const requestKey = `${debouncedQuery}\n${category}\n${debouncedZona}\n${retryToken}`;
  const current = snapshot?.key === requestKey ? snapshot : null;
  const loading = current == null;
  const searchError = current?.error ?? false;
  const results = current?.professionals ?? [];

  useEffect(() => {
    let cancelled = false;
    void listPublicCategories().then((cats) => {
      if (cancelled || !cats) return;
      setCategories(cats);
    });
    return () => {
      cancelled = true;
    };
  }, [retryToken]);

  useEffect(() => {
    let cancelled = false;
    const key = requestKey;
    void searchPublicProfessionals({
      query: debouncedQuery,
      category,
      zona: debouncedZona,
    }).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setSnapshot({ key, error: true, professionals: [] });
        return;
      }
      setSnapshot({ key, error: false, professionals: result.professionals });
    });
    return () => {
      cancelled = true;
    };
  }, [requestKey, debouncedQuery, category, debouncedZona]);

  const openContact = useCallback((p: PublicProfessional) => {
    setContactTarget(p);
  }, []);

  return (
    <section
      id="buscar"
      className="scroll-mt-20 border-t border-yachanga-border bg-yachanga-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="buscar-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-yachanga-primary">
            Profesionales de confianza cerca tuyo
          </p>
          <h2
            id="buscar-heading"
            className="mt-3 text-2xl font-bold text-yachanga-text sm:text-3xl lg:text-4xl"
          >
            Búsqueda de profesionales
          </h2>
          <p className="mt-3 text-base text-yachanga-muted sm:text-lg">
            Explorá perfiles y reseñas sin crear cuenta. Para chatear y contratar, descargá la app.
          </p>
        </div>

        <div className="mt-10">
          <ProfessionalsSearchBar
            query={query}
            category={category}
            zona={zona}
            categories={categories}
            onQueryChange={setQuery}
            onCategoryChange={setCategory}
            onZonaChange={setZona}
          />
        </div>

        <div className="mt-8">
          {loading ? (
            <ProfessionalsGridSkeleton />
          ) : searchError ? (
            <div
              className="flex flex-col items-center rounded-2xl border border-dashed border-yachanga-border bg-yachanga-bg/40 px-6 py-16 text-center"
              role="alert"
            >
              <AlertCircle className="h-12 w-12 text-yachanga-primary" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-yachanga-text">
                No pudimos cargar los profesionales
              </h3>
              <p className="mt-2 max-w-md text-sm text-yachanga-muted">
                Hubo un problema al buscar. Probá de nuevo en un momento.
              </p>
              <button
                type="button"
                onClick={() => setRetryToken((token) => token + 1)}
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-yachanga-primary px-5 text-sm font-semibold text-white hover:bg-yachanga-primary-dark"
              >
                Reintentar
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-yachanga-border bg-yachanga-bg/40 px-6 py-16 text-center">
              <SearchX className="h-12 w-12 text-yachanga-muted" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-yachanga-text">
                {hasFilters ? 'No se encontraron profesionales' : 'Todavía no hay profesionales'}
              </h3>
              <p className="mt-2 max-w-md text-sm text-yachanga-muted">
                {hasFilters
                  ? 'Probá con otro oficio, nombre o zona. También podés limpiar los filtros y explorar todos los perfiles publicados.'
                  : 'Cuando haya perfiles publicados, los vas a ver acá.'}
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setCategory('');
                    setZona('');
                  }}
                  className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-yachanga-primary px-5 text-sm font-semibold text-yachanga-primary hover:bg-yachanga-primary/5"
                >
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <ProfessionalCard
                  key={p.id}
                  professional={p}
                  onOpenProfile={() => setProfileTarget(p)}
                  onContact={() => openContact(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ProfessionalProfileModal
        open={Boolean(profileTarget)}
        professional={profileTarget}
        onClose={() => setProfileTarget(null)}
        onContact={() => {
          if (profileTarget) {
            setContactTarget(profileTarget);
            setProfileTarget(null);
          }
        }}
      />

      <ContactDownloadModal
        open={Boolean(contactTarget)}
        professionalName={contactTarget?.nombre ?? 'este profesional'}
        onClose={() => setContactTarget(null)}
      />
    </section>
  );
}
