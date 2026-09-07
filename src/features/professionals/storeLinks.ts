/** Enlaces de tiendas (configurables por env). */

export const APP_STORE_URL = (import.meta.env.VITE_APP_STORE_URL as string | undefined)?.trim() || '';
export const PLAY_STORE_URL = (import.meta.env.VITE_PLAY_STORE_URL as string | undefined)?.trim() || '';

/** URL canónica para QR de descarga en desktop. */
export const DOWNLOAD_LANDING_URL =
  (import.meta.env.VITE_DOWNLOAD_URL as string | undefined)?.trim() ||
  'https://yachanga.com.ar/#buscar';

export function hasAppStoreLink(): boolean {
  return Boolean(APP_STORE_URL && APP_STORE_URL !== '#');
}

export function hasPlayStoreLink(): boolean {
  return Boolean(PLAY_STORE_URL && PLAY_STORE_URL !== '#');
}
