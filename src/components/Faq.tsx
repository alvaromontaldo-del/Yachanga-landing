import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

type FaqItem = {
  question: string;
  answer: ReactNode;
};

// Texto de docs/faq-landing.md (Tuchanga-app, card #5). Sin porcentajes ni montos.
const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: '¿Qué es YaChanga?',
    answer:
      'YaChanga es una app para contratar oficios y changas. El cliente encuentra un profesional, coordina el trabajo por el chat y deja una reseña cuando termina. El profesional publica sus trabajos, cotiza y aparece en las búsquedas de su zona. Los comercios cotizan los materiales del pedido.',
  },
  {
    question: '¿Para quién es?',
    answer: (
      <>
        <p>Para tres roles, con la misma cuenta:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Cliente: busca profesionales, contrata y sigue los trabajos.</li>
          <li>Profesional: ofrece oficios, manda presupuestos y recibe reseñas.</li>
          <li>Comercio: recibe pedidos de materiales, cotiza y cierra la entrega en el local.</li>
        </ul>
      </>
    ),
  },
  {
    question: '¿Cómo se paga?',
    answer:
      'El cliente paga en la app el costo de servicio YaChanga, con Mercado Pago. El saldo restante se le paga directo al profesional, fuera de la app, y no genera comprobante de Mercado Pago. El precio final del presupuesto incluye las dos partes. En un pedido de materiales, el costo de servicio también se paga en la app; los materiales se le pagan al comercio al retirar.',
  },
  {
    question: '¿El profesional da garantía?',
    answer:
      'Al armar el presupuesto, el profesional indica si incluye garantía. Si la incluye, elige los días: de 1 a 60. También puede cotizar sin garantía. El plazo empieza cuando el trabajo se marca finalizado por primera vez. Mientras está vigente, el cliente puede abrir un reclamo.',
  },
  {
    question: '¿Qué cubre YaChanga si algo sale mal con el profesional?',
    answer:
      'Si ocurre un problema con el profesional, el costo de servicio YaChanga queda cubierto por la app. Esa cobertura es del costo de servicio. No reemplaza lo que se le paga al profesional por fuera de la app.',
  },
  {
    question: '¿Puedo pasar mi teléfono por el chat?',
    answer:
      'El chat es entre el cliente y el profesional. No se pueden mandar teléfonos ni mails. El comercio, en un pedido de materiales, no ve el teléfono ni el mail del cliente.',
  },
  {
    question: '¿Cómo me entero de un mensaje o de un pedido?',
    answer:
      'Con los avisos del teléfono activados, la app notifica mensajes, pagos del costo de servicio, trabajos finalizados y reseñas. Al comercio le avisa cuando entra un pedido a su tablero.',
  },
];

export function Faq() {
  return (
    <section
      id="preguntas-frecuentes"
      className="scroll-mt-20 bg-yachanga-surface py-16 sm:py-20 lg:py-24"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-yachanga-primary">
            Preguntas frecuentes
          </p>
          <h2
            id="faq-heading"
            className="mt-3 text-2xl font-bold text-yachanga-text sm:text-3xl lg:text-4xl"
          >
            ¿Cómo funciona YaChanga?
          </h2>
        </div>

        <div className="mt-12 space-y-4 lg:mt-16">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-yachanga-border bg-yachanga-surface shadow-sm transition-shadow open:shadow-md hover:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left text-base font-bold text-yachanga-text sm:p-6 sm:text-lg [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-yachanga-primary transition-transform group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden
                />
              </summary>
              <div className="px-5 pb-5 text-base leading-relaxed text-yachanga-muted sm:px-6 sm:pb-6">
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
