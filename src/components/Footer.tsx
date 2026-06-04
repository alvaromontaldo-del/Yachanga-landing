import { Apple } from 'lucide-react';

const LOGO_SRC = '/logo-yachanga.png';
const YEAR = new Date().getFullYear();

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.004 1.004 0 0 1-.569-.911V2.725c0-.375.206-.71.568-.911zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-yachanga-border bg-yachanga-surface py-12 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 text-center sm:px-8">
        <img
          src={LOGO_SRC}
          alt="YaChanga"
          className="h-auto w-full max-w-[200px]"
          width={200}
          height={68}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <a
            href="#"
            className="inline-flex min-h-[48px] items-center gap-3 rounded-xl border-2 border-yachanga-primary bg-yachanga-surface px-5 py-3 text-sm font-semibold text-yachanga-primary transition-colors hover:bg-yachanga-primary/5"
            aria-label="Descargar en App Store (próximamente)"
          >
            <Apple className="h-6 w-6 shrink-0 text-yachanga-primary" strokeWidth={2} />
            <span className="text-left leading-tight">
              <span className="block text-xs font-medium text-yachanga-muted">Próximamente</span>
              App Store
            </span>
          </a>
          <a
            href="#"
            className="inline-flex min-h-[48px] items-center gap-3 rounded-xl border-2 border-yachanga-primary bg-yachanga-surface px-5 py-3 text-sm font-semibold text-yachanga-primary transition-colors hover:bg-yachanga-primary/5"
            aria-label="Descargar en Google Play (próximamente)"
          >
            <GooglePlayIcon className="h-6 w-6 shrink-0 text-yachanga-primary" />
            <span className="text-left leading-tight">
              <span className="block text-xs font-medium text-yachanga-muted">Próximamente</span>
              Google Play
            </span>
          </a>
        </div>

        <p className="text-sm text-yachanga-muted">
          © {YEAR} YaChanga ·{' '}
          <a
            href="https://yachanga.com.ar"
            className="font-medium text-yachanga-primary hover:text-yachanga-primary-dark"
          >
            yachanga.com.ar
          </a>
        </p>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-yachanga-muted">
          <a href="#" className="hover:text-yachanga-primary">
            Términos
          </a>
          <a href="#" className="hover:text-yachanga-primary">
            Privacidad
          </a>
          <a href="mailto:hola@yachanga.com.ar" className="hover:text-yachanga-primary">
            Contacto
          </a>
        </nav>
      </div>
    </footer>
  );
}
