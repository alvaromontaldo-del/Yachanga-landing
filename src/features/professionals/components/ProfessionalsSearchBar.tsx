import { Search } from 'lucide-react';

type Props = {
  query: string;
  category: string;
  zona: string;
  categories: string[];
  onQueryChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onZonaChange: (v: string) => void;
};

export function ProfessionalsSearchBar({
  query,
  category,
  zona,
  categories,
  onQueryChange,
  onCategoryChange,
  onZonaChange,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
      <label className="relative block sm:col-span-2 lg:col-span-1">
        <span className="sr-only">Buscar por nombre, profesión o servicio</span>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-yachanga-muted"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ej: Gasista, Plomero, Juan…"
          className="min-h-[48px] w-full rounded-xl border border-yachanga-border bg-yachanga-surface py-3 pl-11 pr-4 text-base text-yachanga-text outline-none transition focus:border-yachanga-primary focus:ring-2 focus:ring-yachanga-primary/20"
          autoComplete="off"
        />
      </label>

      <label className="block">
        <span className="sr-only">Filtrar por categoría</span>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="min-h-[48px] w-full appearance-none rounded-xl border border-yachanga-border bg-yachanga-surface px-4 py-3 text-base text-yachanga-text outline-none transition focus:border-yachanga-primary focus:ring-2 focus:ring-yachanga-primary/20"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="sr-only">Filtrar por zona</span>
        <input
          type="text"
          value={zona}
          onChange={(e) => onZonaChange(e.target.value)}
          placeholder="Zona o ciudad"
          className="min-h-[48px] w-full rounded-xl border border-yachanga-border bg-yachanga-surface px-4 py-3 text-base text-yachanga-text outline-none transition focus:border-yachanga-primary focus:ring-2 focus:ring-yachanga-primary/20"
          autoComplete="off"
        />
      </label>
    </div>
  );
}
