import { Briefcase, MessageCircle, Star } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const BENEFITS = [
  {
    icon: Briefcase,
    title: 'Más Oportunidades de Trabajo',
    description:
      'Accedé a una red local de clientes que buscan activamente tus servicios.',
  },
  {
    icon: Star,
    title: 'Construí tu Reputación',
    description:
      'Ganá reputación y credibilidad con reseñas y comentarios reales de clientes satisfechos.',
  },
  {
    icon: MessageCircle,
    title: 'Conectá Fácilmente',
    description: 'Coordiná visitas y pedidos directamente desde la app.',
  },
] as const;

export function FeaturesWorker() {
  return (
    <section
      id="profesional"
      className="scroll-mt-20 bg-yachanga-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="worker-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-yachanga-primary">
            Para el trabajador
          </p>
          <h2
            id="worker-heading"
            className="mt-3 text-2xl font-bold text-yachanga-text sm:text-3xl lg:text-4xl"
          >
            ¿Sos un Profesional? Hacé crecer tu negocio con YaChanga.
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
