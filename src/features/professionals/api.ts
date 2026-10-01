import type {
  PublicProfessional,
  PublicProfessionalDetail,
  PublicReview,
  PublicSkill,
} from './types';

/**
 * La vidriera pública no inventa profesionales.
 * Si la RPC falla, el llamador muestra un error con reintento.
 * Apellido, lat y lng pueden no venir (la RPC anónima deja de exponerlos):
 * el nombre usa el nombre de pila y, si existe, solo la inicial del apellido.
 * La distancia se muestra solo si el backend manda un valor grueso; nunca se calcula desde coordenadas.
 */

export type ProfessionalsSearchResult =
  | { ok: true; professionals: PublicProfessional[] }
  | { ok: false };

export type ProfessionalDetailResult =
  | { ok: true; detail: PublicProfessionalDetail | null }
  | { ok: false };

const FICTITIOUS_AVATAR =
  /pravatar\.cc|ui-avatars\.com|placehold\.co|via\.placeholder\.com|placeholder\.com|picsum\.photos/i;

function textOrNull(value: unknown): string | null {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function lastNameInitial(value: unknown): string | null {
  const raw = textOrNull(value)?.replace(/\.$/, '') ?? '';
  if (!raw) return null;
  const first = Array.from(raw)[0];
  if (!first || !/\p{L}/u.test(first)) return null;
  return `${first.toLocaleUpperCase('es-AR')}.`;
}

function publicDisplayName(row: Record<string, unknown>): string {
  const first = textOrNull(row.nombre);
  const initial = lastNameInitial(
    row.apellido_inicial ?? row.inicial_apellido ?? row.last_initial ?? row.apellido,
  );
  if (first && initial) return `${first} ${initial}`;
  if (first) return first;
  if (initial) return initial;
  return 'Profesional';
}

function publicAvatar(value: unknown): string | null {
  const url = textOrNull(value);
  if (!url || FICTITIOUS_AVATAR.test(url)) return null;
  return url;
}

function coarseDistance(row: Record<string, unknown>): string | null {
  for (const candidate of [row.distancia, row.distancia_aprox, row.distance_label]) {
    const text = textOrNull(candidate);
    if (text && !/^-?\d+(?:[.,]\d+)?$/.test(text)) return text;
  }

  const numericSource = row.distance_km ?? row.distancia_km ?? row.distancia ?? row.distancia_aprox;
  if (numericSource == null || numericSource === '') return null;
  const kilometers =
    typeof numericSource === 'number'
      ? numericSource
      : Number(String(numericSource).replace(',', '.'));
  if (!Number.isFinite(kilometers) || kilometers < 0) return null;
  const rounded = Math.round(kilometers);
  if (rounded < 1) return 'A menos de 1 km';
  return `A unos ${rounded} km`;
}

export function normalizeProfessional(row: Record<string, unknown>): PublicProfessional {
  const rating = Number(row.rating ?? row.rating_average ?? 0);
  const trades = Array.isArray(row.all_trades)
    ? row.all_trades.map((trade) => String(trade).trim()).filter(Boolean)
    : undefined;

  return {
    id: String(row.id ?? row.profile_id ?? '').trim(),
    nombre: publicDisplayName(row),
    oficio: textOrNull(row.oficio) ?? textOrNull(row.primary_trade) ?? 'Servicios',
    rating: Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0,
    resenas_count: Math.max(0, Math.floor(Number(row.resenas_count ?? row.review_count) || 0)),
    total_jobs_done: Math.max(0, Math.floor(Number(row.total_jobs_done) || 0)),
    avatar: publicAvatar(row.avatar ?? row.avatar_url),
    zona: textOrNull(row.zona),
    distancia: coarseDistance(row),
    all_trades: trades,
  };
}

function supabaseConfig(): { url: string; anon: string } | null {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim().replace(/\/$/, '');
  const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  if (!url || !anon || url.includes('TU_PROJECT')) return null;
  return { url, anon };
}

type RpcResult<T> = { ok: true; data: T } | { ok: false };

/** Fetch a RPC PostgREST sin sesión de usuario (solo anon key). */
async function rpcUnauthenticated<T>(fn: string, body: Record<string, unknown>): Promise<RpcResult<T>> {
  const cfg = supabaseConfig();
  if (!cfg) return { ok: false };

  try {
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
      return { ok: false };
    }

    return { ok: true, data: (await res.json()) as T };
  } catch (error) {
    console.warn(`[professionals] RPC ${fn} failed`, error);
    return { ok: false };
  }
}

export async function searchPublicProfessionals(params: {
  query: string;
  category: string;
  zona: string;
}): Promise<ProfessionalsSearchResult> {
  const result = await rpcUnauthenticated<unknown>('search_workers_public', {
    p_query: params.query.trim(),
    p_category: params.category.trim() || null,
    p_zona: params.zona.trim() || null,
    p_limit: 48,
  });

  if (!result.ok || !Array.isArray(result.data)) return { ok: false };

  return {
    ok: true,
    professionals: result.data
      .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === 'object')
      .map((row) => normalizeProfessional(row))
      .filter((professional) => Boolean(professional.id)),
  };
}

/** `null` si la RPC falla. Un arreglo vacío es una respuesta real, no un error. */
export async function listPublicCategories(): Promise<string[] | null> {
  const result = await rpcUnauthenticated<unknown>('list_public_worker_categories', {});
  if (!result.ok || !Array.isArray(result.data)) return null;

  return result.data
    .map((row) => textOrNull(row && typeof row === 'object' ? (row as { nombre?: unknown }).nombre : null) ?? '')
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'es'));
}

export async function fetchPublicProfessionalDetail(id: string): Promise<ProfessionalDetailResult> {
  const workerId = id.trim();
  if (!workerId) return { ok: true, detail: null };

  const result = await rpcUnauthenticated<unknown>('get_public_worker_profile', {
    p_worker_id: workerId,
  });

  if (!result.ok) return { ok: false };
  if (result.data == null) return { ok: true, detail: null };
  if (typeof result.data !== 'object') return { ok: false };

  const data = result.data as Record<string, unknown>;
  const profileRaw =
    data.profile && typeof data.profile === 'object' ? (data.profile as Record<string, unknown>) : {};
  const profile = {
    ...normalizeProfessional({ ...profileRaw, id: profileRaw.id ?? workerId }),
    descripcion: textOrNull(profileRaw.descripcion) ?? '',
  };

  const habilidades: PublicSkill[] = Array.isArray(data.habilidades)
    ? data.habilidades
        .filter((skill): skill is Record<string, unknown> => Boolean(skill) && typeof skill === 'object')
        .map((skill) => ({
          nombre: textOrNull(skill.nombre) ?? 'Oficio',
          descripcion: textOrNull(skill.descripcion) ?? '',
          anos_experiencia:
            skill.anos_experiencia == null
              ? null
              : Math.max(0, Math.floor(Number(skill.anos_experiencia) || 0)),
          es_principal: Boolean(skill.es_principal),
        }))
    : [];

  const resenas: PublicReview[] = Array.isArray(data.resenas)
    ? data.resenas
        .filter((review): review is Record<string, unknown> => Boolean(review) && typeof review === 'object')
        .map((review) => ({
          id: textOrNull(review.id) ?? crypto.randomUUID(),
          rating: Math.max(0, Math.min(5, Number(review.rating) || 0)),
          comentario: textOrNull(review.comentario) ?? '',
          fecha: textOrNull(review.fecha) ?? '',
          cliente: textOrNull(review.cliente) ?? 'Cliente',
        }))
    : [];

  return { ok: true, detail: { profile, habilidades, resenas } };
}
