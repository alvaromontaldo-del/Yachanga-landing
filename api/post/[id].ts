/**
 * Landing de publicación compartida (HTML + Open Graph).
 * Si la app está instalada, Universal/App Links interceptan /post/:id antes del browser.
 */
export const config = { runtime: 'edge' };

type PublicPost = {
  id: string;
  worker_id: string;
  trade: string;
  description: string;
  image_urls: string[] | null;
  created_at: string;
  worker_nombre: string;
  worker_avatar_url: string | null;
  worker_rating_average: number;
  worker_review_count: number;
  worker_total_jobs_done?: number;
};

function env(name: string): string {
  // Edge/runtime: process.env está disponible en Vercel.
  const g = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
  return (g.process?.env?.[name] ?? '').trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function firstName(full: string): string {
  const t = full.trim();
  if (!t) return 'Profesional';
  return t.split(/\s+/)[0] ?? t;
}

async function fetchPublicPost(id: string): Promise<PublicPost | null> {
  const base = (env('SUPABASE_URL') || env('VITE_SUPABASE_URL')).replace(/\/$/, '');
  const anon = env('SUPABASE_ANON_KEY') || env('VITE_SUPABASE_ANON_KEY');
  if (!base || !anon || !id) return null;

  const res = await fetch(`${base}/rest/v1/rpc/get_public_post`, {
    method: 'POST',
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ p_post_id: id }),
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as PublicPost[];
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

function pageShell(opts: {
  status: number;
  title: string;
  description: string;
  origin: string;
  body: string;
  image?: string;
  url?: string;
}): Response {
  const image = opts.image || `${opts.origin}/logo-yachanga.png`;
  const pageUrl = opts.url || opts.origin;
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.title)}</title>
  <meta name="description" content="${escapeHtml(opts.description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="YaChanga" />
  <meta property="og:title" content="${escapeHtml(opts.title)}" />
  <meta property="og:description" content="${escapeHtml(opts.description)}" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(opts.title)}" />
  <meta name="twitter:description" content="${escapeHtml(opts.description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <link rel="canonical" href="${escapeHtml(pageUrl)}" />
  <link rel="icon" href="/logo-yachanga.png" />
  <style>
    :root { --primary:#C62828; --primary-dark:#8E0000; --bg:#EBEBEB; --text:#1A1A1A; --muted:#6B6B6B; --surface:#fff; --border:#E0E0E0; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:var(--bg); color:var(--text); -webkit-font-smoothing: antialiased; }
    .wrap { max-width: 560px; margin: 0 auto; padding: 20px 16px 40px; }
    .brand { display:flex; justify-content:center; margin-bottom: 16px; }
    .brand img { width: min(200px, 60vw); height: auto; }
    .card { background: var(--surface); border-radius: 16px; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 8px 24px rgba(0,0,0,.06); }
    .head { display:flex; gap: 12px; align-items:center; padding: 16px; }
    .avatar { width: 48px; height: 48px; border-radius: 999px; object-fit: cover; background: #ddd; flex-shrink: 0; }
    .meta h1 { font-size: 1.05rem; margin: 0; }
    .meta .trade { margin: 2px 0 0; color: var(--primary); font-weight: 600; font-size: .92rem; }
    .rating { margin: 4px 0 0; color: var(--muted); font-size: .85rem; }
    .gallery { display: grid; gap: 2px; }
    .shot { width: 100%; max-height: 420px; object-fit: cover; display:block; background:#ddd; }
    .body { padding: 16px; }
    .body p { margin: 0; white-space: pre-wrap; line-height: 1.45; }
    .actions { padding: 0 16px 16px; display: grid; gap: 10px; }
    .btn { display:inline-flex; align-items:center; justify-content:center; min-height: 48px; border-radius: 12px; font-weight: 700; text-decoration:none; padding: 12px 16px; }
    .btn-primary { background: var(--primary); color: #fff; }
    .stores { display: grid; gap: 8px; }
    .store { border: 2px solid var(--primary); border-radius: 12px; padding: 12px 14px; color: var(--primary); font-weight: 700; background: var(--surface); }
    .store .sub { display:block; font-size: .75rem; font-weight: 600; color: var(--muted); }
    .hint { text-align:center; color: var(--muted); font-size: .85rem; margin: 18px 8px 0; line-height: 1.4; }
    .home { display:block; text-align:center; margin-top: 16px; color: var(--primary); font-weight: 600; text-decoration:none; }
    .empty { text-align:center; padding: 28px 12px; }
    .empty h1 { font-size: 1.25rem; margin: 20px 0 8px; }
    .empty p { color: var(--muted); }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="brand"><a href="${opts.origin}/"><img src="/logo-yachanga.png" alt="YaChanga" /></a></div>
    ${opts.body}
  </div>
</body>
</html>`;

  return new Response(html, {
    status: opts.status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control':
        opts.status === 200
          ? 'public, max-age=120, s-maxage=300'
          : 'public, max-age=60',
    },
  });
}

function renderNotFound(origin: string): Response {
  return pageShell({
    status: 404,
    title: 'Publicación no encontrada · YaChanga',
    description: 'Esta publicación no está disponible en YaChanga.',
    origin,
    body: `<div class="card empty">
      <h1>No encontramos esta publicación</h1>
      <p>Puede haber sido eliminada o el enlace es incorrecto.</p>
      <div class="actions" style="padding:16px">
        <a class="btn btn-primary" href="${origin}/">Ir a YaChanga</a>
      </div>
    </div>`,
  });
}

function renderPost(post: PublicPost, origin: string, postPath: string): Response {
  const name = firstName(post.worker_nombre || 'Profesional');
  const trade = (post.trade || 'Servicios').trim();
  const desc = (post.description || '').trim();
  const images = Array.isArray(post.image_urls)
    ? post.image_urls.filter(Boolean)
    : [];
  const cover = images[0] || `${origin}/logo-yachanga.png`;
  const rating = Number(post.worker_rating_average) || 0;
  const reviews = Math.max(0, Math.floor(Number(post.worker_review_count) || 0));
  const jobsDone = Math.max(0, Math.floor(Number(post.worker_total_jobs_done) || 0));
  const showReputation = jobsDone >= 2;
  const title = `${name} · ${trade} | YaChanga`;
  const ogDesc =
    desc.slice(0, 160) || `Mirá el trabajo de ${name} (${trade}) en YaChanga.`;
  const pageUrl = `${origin}${postPath}`;

  const galleryHtml = images
    .slice(0, 3)
    .map(
      (src) =>
        `<img class="shot" src="${escapeHtml(src)}" alt="Trabajo de ${escapeHtml(name)}" loading="lazy" />`,
    )
    .join('');

  const ratingHtml = showReputation
    ? reviews > 0
      ? `<p class="rating">★ ${rating.toFixed(1)} · ${reviews} reseña${reviews === 1 ? '' : 's'}</p>`
      : ''
    : `<p class="rating">Nuevo</p>`;

  const avatar = post.worker_avatar_url
    ? `<img class="avatar" src="${escapeHtml(post.worker_avatar_url)}" alt="${escapeHtml(name)}" />`
    : `<div class="avatar" aria-hidden="true"></div>`;

  const body = `<article class="card">
      <div class="head">
        ${avatar}
        <div class="meta">
          <h1>${escapeHtml(name)}</h1>
          <p class="trade">${escapeHtml(trade)}</p>
          ${ratingHtml}
        </div>
      </div>
      ${galleryHtml ? `<div class="gallery">${galleryHtml}</div>` : ''}
      ${desc ? `<div class="body"><p>${escapeHtml(desc)}</p></div>` : ''}
      <div class="actions">
        <div class="stores">
          <div class="store" role="note">App Store<span class="sub">Próximamente</span></div>
          <div class="store" role="note">Google Play<span class="sub">Próximamente</span></div>
        </div>
      </div>
    </article>
    <p class="hint">Si tenés la app instalada, este enlace debería abrirla automáticamente. Si no, descargala cuando esté en las tiendas.</p>
    <a class="home" href="${origin}/">Conocer YaChanga</a>`;

  return pageShell({
    status: 200,
    title,
    description: ogDesc,
    origin,
    body,
    image: cover,
    url: pageUrl,
  });
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const parts = url.pathname.split('/').filter(Boolean);
  const id = parts[parts.length - 1] || '';
  const uuidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const origin = `${url.protocol}//${url.host}`;

  if (!uuidRe.test(id)) {
    return renderNotFound(origin);
  }

  const post = await fetchPublicPost(id);
  if (!post) {
    return renderNotFound(origin);
  }

  return renderPost(post, origin, `/post/${id}`);
}
