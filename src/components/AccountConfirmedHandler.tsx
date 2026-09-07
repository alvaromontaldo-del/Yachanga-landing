import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const APP_LOGIN_DEEP_LINK = 'tuchanga-app://auth/login';

function isAccountConfirmPath(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/cuenta-confirmada' || path.endsWith('/cuenta-confirmada');
}

/** Celular / tablet táctil (no solo ancho de ventana). */
function isMobileUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    navigator.userAgent,
  );
}

/**
 * Tras Validar cuenta (Supabase), el usuario cae en /cuenta-confirmada:
 * - Móvil: abre el login de la app.
 * - PC: pop-up con instrucciones para ingresar con email y contraseña.
 */
export function AccountConfirmedHandler() {
  const [showDesktopModal, setShowDesktopModal] = useState(false);

  useEffect(() => {
    if (!isAccountConfirmPath()) return;

    if (isMobileUserAgent()) {
      // Intento abrir la app en login; si no hay app, el usuario permanece en la landing.
      window.location.href = APP_LOGIN_DEEP_LINK;
      return;
    }

    setShowDesktopModal(true);
  }, []);

  if (!showDesktopModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-confirmed-title"
      onClick={() => setShowDesktopModal(false)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-yachanga-surface p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowDesktopModal(false)}
          className="absolute right-3 top-3 rounded-lg p-2 text-yachanga-muted hover:bg-yachanga-bg hover:text-yachanga-text"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-sm font-semibold uppercase tracking-wide text-yachanga-primary">
          Cuenta confirmada
        </p>
        <h2
          id="account-confirmed-title"
          className="mt-2 text-xl font-extrabold text-yachanga-text sm:text-2xl"
        >
          ¡Listo! Ya podés usar YaChanga
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-yachanga-muted sm:text-base">
          Tu correo quedó validado. Abrí la app YaChanga e iniciá sesión con el mismo usuario
          (email) y contraseña con los que te registraste.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-yachanga-muted sm:text-base">
          Si todavía no tenés la app instalada, descargala desde la tienda de tu celular y luego
          ingresá con esos datos.
        </p>

        <button
          type="button"
          onClick={() => setShowDesktopModal(false)}
          className="mt-6 inline-flex w-full min-h-[48px] items-center justify-center rounded-full bg-yachanga-primary px-6 text-base font-bold text-white transition hover:bg-yachanga-primary/90"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
