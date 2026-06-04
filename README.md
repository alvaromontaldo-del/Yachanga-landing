# YaChanga — Landing (yachanga.com.ar)

Sitio estático de presentación para **YaChanga**. Listo para **Vercel** + dominio `yachanga.com.ar`.

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

## Estructura

| Ruta | Descripción |
|------|-------------|
| `src/components/Hero.tsx` | Logo, eslogan, CTAs |
| `src/components/FeaturesWorker.tsx` | Beneficios profesionales |
| `src/components/FeaturesClient.tsx` | Beneficios clientes |
| `src/components/Footer.tsx` | Stores y copyright |
| `public/logo-yachanga.png` | Logo de marca |
| `vercel.json` | Configuración de build para Vercel |

## Colores de marca

| Token | Hex |
|-------|-----|
| Primario | `#C62828` |
| Primario oscuro | `#8E0000` |
| Fondo | `#EBEBEB` |
| Texto | `#1A1A1A` |
