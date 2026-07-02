import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

const testimonialKeys = ['testimonial1', 'testimonial2'] as const;

export default function TestimonialsSection() {
  const t = useTranslations('home.testimonials');

  return (
    <section className="bg-surface-dark py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-on-dark sm:text-3xl">
            {t('title')}
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 bg-primary-light" />
        </div>

        {/* Testimonial cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {testimonialKeys.map((key) => (
            <div
              key={key}
              className="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mb-4 text-sm leading-relaxed text-text-on-dark-muted">
                &ldquo;{t(`items.${key}.quote`)}&rdquo;
              </p>

              {/* Author */}
              <p className="text-sm font-semibold text-text-on-dark">
                {t(`items.${key}.name`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
