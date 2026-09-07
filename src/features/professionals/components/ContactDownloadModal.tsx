import type { ReactNode } from 'react';
import { Apple, X } from 'lucide-react';
import {
  APP_STORE_URL,
  DOWNLOAD_LANDING_URL,
  PLAY_STORE_URL,
  hasAppStoreLink,
  hasPlayStoreLink,
} from '../storeLinks';
import { useIsDesktop } from '../hooks';

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.004 1.004 0 0 1-.569-.911V2.725c0-.375.206-.71.568-.911zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}

type StoreBtnProps = {
  href: string;
  available: boolean;
  children: ReactNode;
};

function StoreButton({ href, available, children }: StoreBtnProps) {
  if (!available) {
    return (
      <span className="inline-flex min-h-[52px] cursor-default items-center gap-3 rounded-xl border-2 border-yachanga-primary bg-yachanga-surface px-5 py-3 text-sm font-semibold text-yachanga-primary opacity-90">
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[52px] items-center gap-3 rounded-xl border-2 border-yachanga-primary bg-yachanga-surface px-5 py-3 text-sm font-semibold text-yachanga-primary transition hover:bg-yachanga-primary/5"
    >
      {children}
    </a>
  );
}

type Props = {
  open: boolean;
  professionalName: string;
  onClose: () => void;
};

export function ContactDownloadModal({ open, professionalName, onClose }: Props) {
  const isDesktop = useIsDesktop();
  if (!open) return null;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(DOWNLOAD_LANDING_URL)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-download-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-yachanga-surface p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-yachanga-muted hover:bg-yachanga-bg hover:text-yachanga-text"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="contact-download-title"
          className="pr-8 text-xl font-bold text-yachanga-text sm:text-2xl"
        >
          Contacta a este profesional desde la app
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-yachanga-muted sm:text-base">
          Para chatear, pedir presupuestos y coordinar de forma segura con{' '}
          <span className="font-semibold text-yachanga-text">{professionalName}</span>, descarga
          Yachanga.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <StoreButton href={APP_STORE_URL} available={hasAppStoreLink()}>
            <Apple className="h-7 w-7 shrink-0" strokeWidth={2} />
            <span className="text-left leading-tight">
              <span className="block text-xs font-medium text-yachanga-muted">
                {hasAppStoreLink() ? 'Descargar en' : 'Próximamente'}
              </span>
              App Store
            </span>
          </StoreButton>
          <StoreButton href={PLAY_STORE_URL} available={hasPlayStoreLink()}>
            <GooglePlayIcon className="h-7 w-7 shrink-0" />
            <span className="text-left leading-tight">
              <span className="block text-xs font-medium text-yachanga-muted">
                {hasPlayStoreLink() ? 'Descargar en' : 'Próximamente'}
              </span>
              Google Play
            </span>
          </StoreButton>
        </div>

        {isDesktop ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-yachanga-border bg-yachanga-bg/60 p-5">
            <img
              src={qrSrc}
              alt="Código QR para descargar YaChanga"
              width={180}
              height={180}
              className="rounded-lg bg-white p-2"
            />
            <p className="max-w-xs text-center text-xs text-yachanga-muted">
              Escaneá el código con tu celular para ir a la descarga de Yachanga.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
