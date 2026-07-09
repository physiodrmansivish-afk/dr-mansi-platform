'use client';

import { useTranslations } from 'next-intl';
import { Star, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import MediaLightbox from '../shared/MediaLightbox';

const testimonialKeys = ['testimonial1', 'testimonial2'] as const;

export default function TestimonialsSection() {
  const t = useTranslations('home.testimonials');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className="bg-surface-dark py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-text-on-dark sm:text-3xl">
            {t('title')}
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 bg-primary-light" />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* Video Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div 
              className="relative aspect-[4/5] sm:aspect-video w-full overflow-hidden rounded-2xl cursor-pointer group shadow-2xl"
              onClick={() => setIsVideoOpen(true)}
            >
              <video 
                src="/media/videos/testimonial.mp4" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                muted
                playsInline
                loop
                autoPlay
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform group-hover:scale-110">
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -left-4 -bottom-4 -z-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl"></div>
          </motion.div>

          {/* Text Testimonials */}
          <motion.div 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {testimonialKeys.map((key) => (
              <div
                key={key}
                className="rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
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
          </motion.div>
        </div>
      </div>

      <MediaLightbox 
        isOpen={isVideoOpen}
        onOpenChange={setIsVideoOpen}
        src="/media/videos/testimonial.mp4"
        type="video"
      />
    </section>
  );
}
