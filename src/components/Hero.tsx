const LOGO_SRC = '/logo-yachanga.png';

type Props = {
  onRegisterProfessional?: () => void;
  onFindProfessional?: () => void;
};

export function Hero({ onRegisterProfessional, onFindProfessional }: Props) {
  return (
    <header className="relative overflow-hidden bg-yachanga-bg">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yachanga-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yachanga-primary/5 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pb-16 pt-10 text-center sm:px-8 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16">
        <img
          src={LOGO_SRC}
          alt="YaChanga"
          className="h-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px]"
          width={360}
          height={120}
        />

        <p className="mt-6 max-w-2xl text-2xl font-semibold tracking-tight text-yachanga-text sm:mt-8 sm:text-3xl lg:text-4xl">
          Encontrá el profesional que necesitás,{' '}
          <span className="text-yachanga-primary">ya.</span>
        </p>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-yachanga-muted sm:text-lg">
          Conectamos personas con profesionales de confianza en tu zona. Publicá tu necesidad o
          ofrecé tus servicios desde la app.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">
          <a
            href="#profesional"
            onClick={onRegisterProfessional}
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-yachanga-primary px-8 text-base font-semibold text-white shadow-md transition-colors hover:bg-yachanga-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yachanga-primary"
          >
            Regístrate como Profesional
          </a>
          <a
            href="#buscar"
            onClick={onFindProfessional}
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-yachanga-primary bg-yachanga-surface px-8 text-base font-semibold text-yachanga-primary transition-colors hover:bg-yachanga-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yachanga-primary"
          >
            Buscar un Profesional
          </a>
        </div>
      </div>
    </header>
  );
}
