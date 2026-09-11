import type {
  PublicProfessional,
  PublicProfessionalDetail,
  PublicReview,
  PublicSkill,
} from './types';

const MOCK_PROFESSIONALS: PublicProfessional[] = [
  {
    id: 'mock-1',
    nombre: 'Juan',
    oficio: 'Electricista Matriculado',
    rating: 4.9,
    resenas_count: 28,
    total_jobs_done: 12,
    avatar: 'https://i.pravatar.cc/150?u=juan-elec',
    zona: 'San Nicolás',
    all_trades: ['Electricista Matriculado', 'Instalaciones'],
  },
  {
    id: 'mock-2',
    nombre: 'María',
    oficio: 'Gasista',
    rating: 4.8,
    resenas_count: 15,
    total_jobs_done: 8,
    avatar: 'https://i.pravatar.cc/150?u=maria-gas',
    zona: 'Rosario',
    all_trades: ['Gasista'],
  },
  {
    id: 'mock-3',
    nombre: 'Carlos',
    oficio: 'Plomero',
    rating: 4.6,
    resenas_count: 42,
    total_jobs_done: 20,
    avatar: 'https://i.pravatar.cc/150?u=carlos-plom',
    zona: 'Villa Constitución',
    all_trades: ['Plomero', 'Destapaciones'],
  },
  {
    id: 'mock-4',
    nombre: 'Lucía',
    oficio: 'Pintora',
    rating: 5,
    resenas_count: 1,
    total_jobs_done: 1,
    avatar: 'https://i.pravatar.cc/150?u=lucia-pint',
    zona: 'San Nicolás',
    all_trades: ['Pintora'],
  },
  {
    id: 'mock-5',
    nombre: 'Diego',
    oficio: 'Albañil',
    rating: 4.7,
    resenas_count: 21,
    total_jobs_done: 15,
    avatar: 'https://i.pravatar.cc/150?u=diego-alb',
    zona: 'Pergamino',
    all_trades: ['Albañil', 'Refacciones'],
  },
  {
    id: 'mock-6',
    nombre: 'Ana',
    oficio: 'Aire acondicionado',
    rating: 4.5,
    resenas_count: 0,
    total_jobs_done: 0,
    avatar: 'https://i.pravatar.cc/150?u=ana-ac',
    zona: 'Rosario',
    all_trades: ['Aire acondicionado'],
  },
];

const MOCK_DETAILS: Record<string, PublicProfessionalDetail> = {
  'mock-1': {
    profile: {
      ...MOCK_PROFESSIONALS[0],
      descripcion:
        'Electricista matriculado con más de 10 años de experiencia en instalaciones domiciliarias e industriales. Trabajo prolijo y con garantía.',
    },
    habilidades: [
      {
        nombre: 'Electricista Matriculado',
        descripcion: 'Tableros, cableado, iluminación LED y certificaciones.',
        anos_experiencia: 10,
        es_principal: true,
      },
      {
        nombre: 'Instalaciones',
        descripcion: 'Montaje de tomas, circuitos y puesta a tierra.',
        anos_experiencia: 8,
        es_principal: false,
      },
    ],
    resenas: [
      {
        id: 'r1',
        rating: 5,
        comentario: 'Excelente trabajo, llegó puntual y dejó todo impecable.',
        fecha: '2026-07-12T10:00:00Z',
        cliente: 'Sofía',
      },
      {
        id: 'r2',
        rating: 5,
        comentario: 'Muy claro con el presupuesto y cumplió los plazos.',
        fecha: '2026-06-03T15:30:00Z',
        cliente: 'Martín',
      },
    ],
  },
};

function normalizeProfessional(row: Record<string, unknown>): PublicProfessional {
  const rating = Number(row.rating ?? 0);
  return {
    id: String(row.id ?? ''),
    nombre: String(row.nombre ?? 'Profesional').trim() || 'Profesional',
    oficio: String(row.oficio ?? 'Servicios').trim() || 'Servicios',
    rating: Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0,
    resenas_count: Math.max(0, Math.floor(Number(row.resenas_count) || 0)),
    total_jobs_done: Math.max(0, Math.floor(Number(row.total_jobs_done) || 0)),
    avatar: row.avatar ? String(row.avatar) : null,
    zona: row.zona ? String(row.zona) : null,
    all_trades: Array.isArray(row.all_trades)
      ? row.all_trades.map((t) => String(t))
      : undefined,
  };
}

function filterMock(params: {
  query: string;
  category: string;
  zona: string;
}): PublicProfessional[] {
  const q = params.query.trim().toLowerCase();
  const cat = params.category.trim().toLowerCase();
  const zona = params.zona.trim().toLowerCase();
  return MOCK_PROFESSIONALS.filter((p) => {
    const hay = `${p.nombre} ${p.oficio} ${(p.all_trades ?? []).join(' ')}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (cat && !(p.all_trades ?? [p.oficio]).some((t) => t.toLowerCase() === cat)) return false;
    if (zona && !(p.zona ?? '').toLowerCase().includes(zona)) return false;
    return true;
  });
}

function supabaseConfig(): { url: string; anon: string } | null {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim().replace(/\/$/, '');
  const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  if (!url || !anon || url.includes('TU_PROJECT')) return null;
  return { url, anon };
}

/** Fetch a RPC PostgREST sin sesión de usuario (solo anon key). */
async function rpcUnauthenticated<T>(
  fn: string,
  body: Record<string, unknown>,
): Promise<T | null> {
  const cfg = supabaseConfig();
  if (!cfg) return null;

  const res = await fetch(`${cfg.url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: cfg.anon,
      Authorization: `Bearer ${cfg.anon}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn(`[professionals] RPC ${fn} failed`, res.status);
    return null;
  }
  return (await res.json()) as T;
}

export async function searchPublicProfessionals(params: {
  query: string;
  category: string;
  zona: string;
}): Promise<PublicProfessional[]> {
  const rows = await rpcUnauthenticated<Record<string, unknown>[]>('search_workers_public', {
    p_query: params.query.trim(),
    p_category: params.category.trim() || null,
    p_zona: params.zona.trim() || null,
    p_limit: 48,
  });

  if (!rows) {
    return filterMock(params);
  }

  return rows.map(normalizeProfessional).filter((p) => Boolean(p.id));
}

export async function listPublicCategories(): Promise<string[]> {
  const rows = await rpcUnauthenticated<Array<{ nombre?: string }>>(
    'list_public_worker_categories',
    {},
  );

  if (!rows) {
    return [...new Set(MOCK_PROFESSIONALS.flatMap((p) => p.all_trades ?? [p.oficio]))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    );
  }

  return rows
    .map((r) => String(r.nombre ?? '').trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'es'));
}

export async function fetchPublicProfessionalDetail(
  id: string,
): Promise<PublicProfessionalDetail | null> {
  if (id.startsWith('mock-')) {
    const base = MOCK_DETAILS[id];
    if (base) return base;
    const card = MOCK_PROFESSIONALS.find((p) => p.id === id);
    if (!card) return null;
    return {
      profile: {
        ...card,
        descripcion: `${card.oficio} de confianza en ${card.zona ?? 'tu zona'}.`,
      },
      habilidades: [
        {
          nombre: card.oficio,
          descripcion: 'Servicios a medida.',
          anos_experiencia: null,
          es_principal: true,
        },
      ],
      resenas: [] as PublicReview[],
    };
  }

  const data = await rpcUnauthenticated<Record<string, unknown> | null>(
    'get_public_worker_profile',
    { p_worker_id: id },
  );

  if (!data || typeof data !== 'object') return null;

  const profileRaw = (data.profile ?? {}) as Record<string, unknown>;
  const profile = {
    ...normalizeProfessional(profileRaw),
    descripcion: String(profileRaw.descripcion ?? '').trim(),
  };

  const habilidades: PublicSkill[] = Array.isArray(data.habilidades)
    ? (data.habilidades as Record<string, unknown>[]).map((h) => ({
        nombre: String(h.nombre ?? '').trim() || 'Oficio',
        descripcion: String(h.descripcion ?? '').trim(),
        anos_experiencia:
          h.anos_experiencia == null ? null : Math.max(0, Math.floor(Number(h.anos_experiencia) || 0)),
        es_principal: Boolean(h.es_principal),
      }))
    : [];

  const resenas: PublicReview[] = Array.isArray(data.resenas)
    ? (data.resenas as Record<string, unknown>[]).map((r) => ({
        id: String(r.id ?? crypto.randomUUID()),
        rating: Math.max(0, Math.min(5, Number(r.rating) || 0)),
        comentario: String(r.comentario ?? '').trim(),
        fecha: String(r.fecha ?? ''),
        cliente: String(r.cliente ?? 'Cliente').trim() || 'Cliente',
      }))
    : [];

  return { profile, habilidades, resenas };
}
