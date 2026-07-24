'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import MediaLightbox from '../shared/MediaLightbox';

interface GalleryItem {
  src: string;
  type: 'image' | 'video';
}

const galleryItems: GalleryItem[] = [
  { src: '/media/images/work-1.jpeg', type: 'image' },
  { src: '/media/videos/video-1.mp4', type: 'video' },
  { src: '/media/images/work-3.jpeg', type: 'image' },
  { src: '/media/images/work-4.jpeg', type: 'image' },
  { src: '/media/videos/video-2.mp4', type: 'video' },
  { src: '/media/images/work-5.jpeg', type: 'image' },
  { src: '/media/images/work-6.jpeg', type: 'image' },
  { src: '/media/images/work-7.jpeg', type: 'image' },
  { src: '/media/videos/video-3.mp4', type: 'video' },
  { src: '/media/images/work-8.jpeg', type: 'image' },
  { src: '/media/images/work-9.jpeg', type: 'image' },
  { src: '/media/images/work-10.jpeg', type: 'image' },
  { src: '/media/images/work-11.jpeg', type: 'image' },
  { src: '/media/videos/video-12.mp4', type: 'video' },
];

export default function WorkGallerySection() {
  const t = useTranslations('home.workGallery');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  return (
    <section className="bg-surface py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">
            {t('title')}
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-12 bg-primary" />
          <p className="mx-auto mt-3 max-w-lg text-base text-text-muted">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Scrollable gallery */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.src}
                className="shrink-0 w-[220px] sm:w-auto snap-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => setLightboxItem(item)}
                  className="group relative block w-full aspect-[3/4] overflow-hidden rounded-xl shadow-card transition-shadow hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt="Dr. Mansi's physiotherapy work"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative h-full w-full bg-gray-900">
                      <video
                        src={item.src}
                        className="h-full w-full object-cover opacity-80"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-lg transition-transform group-hover:scale-110">
                          <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <MediaLightbox
          isOpen={!!lightboxItem}
          onOpenChange={(open) => { if (!open) setLightboxItem(null); }}
          src={lightboxItem.src}
          type={lightboxItem.type}
        />
      )}
    </section>
  );
}
