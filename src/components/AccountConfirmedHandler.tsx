import { useCallback, useEffect, useMemo, useState } from 'react';
import type { EmailOtpType } from '@supabase/supabase-js';
import { CheckCircle2, Loader2, X, XCircle } from 'lucide-react';
import { getSupabaseBrowser } from '../lib/supabaseBrowser';

const APP_LOGIN_DEEP_LINK = 'tuchanga-app://auth/login';

type UiStatus = 'idle' | 'ready' | 'verifying' | 'success' | 'error';

function isAccountConfirmPath(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/cuenta-confirmada' || path.endsWith('/cuenta-confirmada');
}

function isMobileUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    navigator.userAgent,
  );
}

function readAuthParams(): {
  tokenHash: string | null;
  type: EmailOtpType;
  error: string | null;
  errorDescription: string | null;
  code: string | null;
} {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const get = (key: string) => search.get(key) ?? hash.get(key);

  const rawType = (get('type') ?? 'email').toLowerCase();
  const type: EmailOtpType =
    rawType === 'signup' ||
    rawType === 'email' ||
    rawType === 'invite' ||
    rawType === 'magiclink' ||
    rawType === 'recovery' ||
    rawType === 'email_change'
      ? (rawType as EmailOtpType)
      : 'email';

  return {
    tokenHash: get('token_hash') ?? get('token'),
    type,
    error: get('error'),
    errorDescription: get('error_description') ?? get('error_code'),
    code: get('code'),
  };
}

/**
 * /cuenta-confirmada:
 * - Con token_hash (plantilla anti-prefetch): el usuario confirma con un click humano → verifyOtp.
 * - Si Supabase redirigió con error: se muestra el fallo (no se abre la app fingiendo éxito).
 * - Tras OK: un solo diálogo (con X / Entendido); en móvil además deep-link al login.
 */
export function AccountConfirmedHandler() {
  const onConfirmPath = useMemo(() => isAccountConfirmPath(), []);
  const [status, setStatus] = useState<UiStatus>('idle');
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);
  const [params, setParams] = useState<ReturnType<typeof readAuthParams> | null>(null);

  useEffect(() => {
    if (!onConfirmPath) return;
    const p = readAuthParams();
    setParams(p);

    if (p.error) {
      setStatus('error');
      setMessage(
        decodeURIComponent(p.errorDescription ?? p.error).replace(/\+/g, ' ') ||
          'El enlace de confirmación no es válido o ya se usó.',
      );
      return;
    }

    // Enlace con token: esperar click humano (anti-prefetch de Gmail/Outlook).
    if (p.tokenHash) {
      setStatus('ready');
      setMessage('Tocá el botón para confirmar tu correo y continuar.');
      return;
    }

    // Redirect clásico de ConfirmationURL sin token en query: el verify ya ocurrió en Supabase.
    setStatus('success');
    setMessage('Si tu correo quedó validado, ya podés ingresar a la app.');
    if (isMobileUserAgent()) {
      window.setTimeout(() => {
        window.location.href = APP_LOGIN_DEEP_LINK;
      }, 400);
    }
  }, [onConfirmPath]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('token_hash');
      url.searchParams.delete('token');
      url.searchParams.delete('type');
      url.searchParams.delete('code');
      url.searchParams.delete('error');
      url.searchParams.delete('error_description');
      url.searchParams.delete('error_code');
      window.history.replaceState({}, '', url.pathname === '/cuenta-confirmada' ? '/' : url.pathname);
    } catch {
      /* ignore */
    }
  }, []);

  const finishSuccess = useCallback(() => {
    setStatus('success');
    setMessage('¡Listo! Tu correo quedó validado.');
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('token_hash');
      url.searchParams.delete('token');
      url.searchParams.delete('type');
      url.searchParams.delete('code');
      window.history.replaceState({}, '', url.pathname);
    } catch {
      /* ignore */
    }

    if (isMobileUserAgent()) {
      window.location.href = APP_LOGIN_DEEP_LINK;
    }
  }, []);

  const confirmAccount = useCallback(async () => {
    if (!params?.tokenHash) {
      setStatus('error');
      setMessage('Falta el código de confirmación en el enlace. Pedí un correo nuevo desde la app.');
      return;
    }

    const sb = getSupabaseBrowser();
    if (!sb) {
      setStatus('error');
      setMessage('No se pudo conectar con el servidor de autenticación. Probá más tarde.');
      return;
    }

    setStatus('verifying');
    setMessage('Confirmando tu correo…');

    const tryTypes: EmailOtpType[] = Array.from(
      new Set<EmailOtpType>([params.type, 'email', 'signup']),
    );

    let lastError = 'No se pudo confirmar el correo.';
    for (const type of tryTypes) {
      const { error } = await sb.auth.verifyOtp({
        token_hash: params.tokenHash,
        type,
      });
      if (!error) {
        try {
          await sb.auth.signOut({ scope: 'local' });
        } catch {
          /* ignore */
        }
        finishSuccess();
        return;
      }
      lastError = error.message;
      if (/expired|invalid|otp/i.test(error.message)) break;
    }

    setStatus('error');
    setMessage(
      /expired|invalid/i.test(lastError)
        ? 'Este enlace ya se usó o venció. Registrate de nuevo o pedí reenviar el correo de confirmación.'
        : lastError,
    );
  }, [params, finishSuccess]);

  if (!onConfirmPath || dismissed) return null;

  const canClose = status === 'success' || status === 'error';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-confirm-title"
      onClick={canClose ? dismiss : undefined}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-yachanga-surface p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {canClose ? (
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-3 top-3 rounded-lg p-2 text-yachanga-muted hover:bg-yachanga-bg hover:text-yachanga-text"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        {status === 'error' ? (
          <XCircle className="h-10 w-10 text-yachanga-primary" aria-hidden />
        ) : status === 'success' ? (
          <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden />
        ) : null}

        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-yachanga-primary">
          {status === 'error' ? 'No se pudo confirmar' : 'Confirmación de cuenta'}
        </p>
        <h2
          id="account-confirm-title"
          className="mt-2 text-xl font-extrabold text-yachanga-text sm:text-2xl"
        >
          {status === 'error'
            ? 'Revisá el enlace'
            : status === 'success'
              ? '¡Cuenta confirmada!'
              : 'Validá tu correo'}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-yachanga-muted sm:text-base">{message}</p>

        {status === 'ready' || status === 'verifying' ? (
          <button
            type="button"
            disabled={status === 'verifying'}
            onClick={() => void confirmAccount()}
            className="mt-6 inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-yachanga-primary px-6 text-base font-bold text-white transition hover:bg-yachanga-primary/90 disabled:opacity-70"
          >
            {status === 'verifying' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Confirmando…
              </>
            ) : (
              'Confirmar y abrir YaChanga'
            )}
          </button>
        ) : null}

        {status === 'success' && isMobileUserAgent() ? (
          <a
            href={APP_LOGIN_DEEP_LINK}
            className="mt-6 inline-flex w-full min-h-[48px] items-center justify-center rounded-full bg-yachanga-primary px-6 text-base font-bold text-white transition hover:bg-yachanga-primary/90"
          >
            Abrir app e ingresar
          </a>
        ) : null}

        {canClose ? (
          <button
            type="button"
            onClick={dismiss}
            className={
              status === 'success' && isMobileUserAgent()
                ? 'mt-3 inline-flex w-full min-h-[48px] items-center justify-center rounded-full border border-yachanga-border bg-transparent px-6 text-base font-bold text-yachanga-text transition hover:bg-yachanga-bg'
                : 'mt-6 inline-flex w-full min-h-[48px] items-center justify-center rounded-full bg-yachanga-primary px-6 text-base font-bold text-white transition hover:bg-yachanga-primary/90'
            }
          >
            Entendido
          </button>
        ) : null}

        {status === 'error' ? (
          <p className="mt-4 text-sm text-yachanga-muted">
            Si el enlace falló porque el correo lo abrió solo (Gmail/Outlook), pedí un nuevo mail
            de confirmación o escribí a soporte.
          </p>
        ) : null}
      </div>
    </div>
  );
}
