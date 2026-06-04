import { Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'Soluciones Rápidas',
    description: 'Publicá tu necesidad y recibí cotizaciones al instante.',
  },
  {
    icon: ShieldCheck,
    title: 'Profesionales Confiables',
    description: 'Elegí basándote en la reputación, reseñas y cercanía del profesional.',
  },
  {
    icon: Clock,
    title: 'Sin Estrés',
    description: 'Coordiná visitas y pagos de forma segura.',
  },
] as const;

export function FeaturesClient() {
  return (
    <section
      id="cliente"
      className="scroll-mt-20 bg-yachanga-bg py-16 sm:py-20 lg:py-24"
      aria-labelledby="client-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-yachanga-primary">
            Para el cliente
          </p>
          <h2
            id="client-heading"
            className="mt-3 text-2xl font-bold text-yachanga-text sm:text-3xl lg:text-4xl"
          >
            ¿Necesitás ayuda? Encontrá profesionales confiables en minutos.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {BENEFITS.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
