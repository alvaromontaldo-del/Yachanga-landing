export function ProfessionalCardSkeleton() {
  return (
    <div
      className="animate-pulse rounded-2xl border border-yachanga-border bg-yachanga-surface p-5 shadow-sm"
      aria-hidden
    >
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 shrink-0 rounded-full bg-yachanga-border" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded bg-yachanga-border" />
          <div className="h-4 w-1/2 rounded bg-yachanga-border" />
          <div className="h-3 w-3/5 rounded bg-yachanga-border" />
        </div>
      </div>
      <div className="mt-5 h-11 w-full rounded-xl bg-yachanga-border" />
    </div>
  );
}

export function ProfessionalsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-live="polite"
      aria-label="Cargando profesionales"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProfessionalCardSkeleton key={i} />
      ))}
    </div>
  );
}
