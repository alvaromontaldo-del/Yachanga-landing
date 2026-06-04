import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function FeatureCard({ icon: Icon, title, description }: Props) {
  return (
    <article className="flex flex-col rounded-2xl border border-yachanga-border bg-yachanga-surface p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-yachanga-primary/10"
        aria-hidden
      >
        <Icon className="h-6 w-6 text-yachanga-primary" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-yachanga-text sm:text-xl">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-yachanga-muted">{description}</p>
    </article>
  );
}
