# YaChanga — Landing (yachanga.com.ar)

Sitio estático de presentación para **YaChanga**. Listo para **Vercel** + dominio `yachanga.com.ar`.

## Confirmación de cuenta (`/cuenta-confirmada`)

Tras **Validar cuenta** en el mail de registro, Supabase redirige a
`https://www.yachanga.com.ar/cuenta-confirmada`:

- En **celular** se intenta abrir el login de la app (`tuchanga-app://auth/login`).
- En **PC** se muestra un pop-up indicando que ya puede ingresar a la app con email y contraseña.

Registrá esa URL en Supabase → **Redirect URLs**.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Lucide React

## Desarrollo local

```bash
npm install
npm run dev
```

→ [http://localhost:5173](http://localhost:5173)

## Subir a GitHub (repositorio nuevo)

**Importante:** la raíz del repositorio en GitHub debe ser **esta carpeta** (`yachanga-landing`), no el monorepo completo `Tu Changa`.

```bash
cd yachanga-landing
git init
git add .
git commit -m "Landing YaChanga — Vite + React + Tailwind"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

Reemplazá `TU_USUARIO` y `TU_REPO` por tu repo nuevo.

## Desplegar en Vercel

1. Entrá a [vercel.com](https://vercel.com) → **Add New** → **Project**.
2. **Import** el repositorio de GitHub que acaban de crear.
3. Vercel detecta **Vite** automáticamente. Dejá:
   - **Root Directory:** `.` (vacío / raíz del repo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. **Deploy**.

Si el repo incluye todo `Tu Changa` (app + landing), en Vercel configurá **Root Directory** = `yachanga-landing`.

### Dominio yachanga.com.ar

En el proyecto de Vercel → **Settings** → **Domains** → agregá `yachanga.com.ar` y `www.yachanga.com.ar`. Seguí las instrucciones de DNS (registros que te indique Vercel en tu proveedor de dominio).

## Publicaciones compartidas (`/post/:id`)

Al compartir desde la app se genera `https://yachanga.com.ar/post/{postId}`.

- **Con app instalada:** Universal Links (iOS) / App Links (Android) abren `PostDetail`.
- **Sin app:** `api/post/[id].ts` sirve HTML con preview + Open Graph + CTAs “Próximamente” (stores).

### Variables en Vercel

Configurá en el proyecto (Production):

- `SUPABASE_URL` (o `VITE_SUPABASE_URL`)
- `SUPABASE_ANON_KEY` (o `VITE_SUPABASE_ANON_KEY`)

Aplicá en Supabase la migración `get_public_post` del repo de la app.

### App Links (Android)

En `public/.well-known/assetlinks.json` reemplazá `REPLACE_WITH_EAS_OR_PLAY_APP_SIGNING_SHA256` por el SHA-256 del keystore (EAS credentials o Play App Signing).

### Universal Links (iOS)

`public/.well-known/apple-app-site-association` ya apunta a `LXWW348236.com.cuervolinkedout.tuchanga`.

Hace falta un **build nativo nuevo** (no alcanza OTA) para que associated domains / intent filters entren en el binario.

## Vidriera de profesionales (`#buscar`)

Búsqueda pública sin login: perfiles, oficios, rating y reseñas. **Contactar** abre el modal de descarga de la app (stores + QR en desktop).

Requiere en Supabase la migración `20260903140000_public_workers_storefront.sql` del repo de la app (`search_workers_public`, `get_public_worker_profile`, `list_public_worker_categories`).

Sin `VITE_SUPABASE_*` configurado, la sección usa datos mock locales.

## Estructura

| Ruta | Descripción |
|------|-------------|
| `src/components/Hero.tsx` | Logo, eslogan, CTAs |
| `src/features/professionals/` | Vidriera: búsqueda, tarjetas, perfil, modal Contactar |
| `src/components/FeaturesWorker.tsx` | Beneficios profesionales |
| `src/components/FeaturesClient.tsx` | Beneficios clientes |
| `src/components/Footer.tsx` | Stores y copyright |
| `api/post/[id].ts` | Landing SSR-lite de publicación compartida |
| `public/.well-known/*` | AASA + Digital Asset Links |
| `public/logo-yachanga.png` | Logo de marca |
| `vercel.json` | Rewrites `/post/:id` + headers well-known |

## Colores de marca

| Token | Hex |
|-------|-----|
| Primario | `#C62828` |
| Primario oscuro | `#8E0000` |
| Fondo | `#EBEBEB` |
| Texto | `#1A1A1A` |
