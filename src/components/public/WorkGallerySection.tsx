'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play carousel logic
  useEffect(() => {
    if (isHovered) return; // Pause auto-play on hover

    const intervalId = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If we reached the end, scroll back to the start
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll forward by roughly one card width
          scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
        }
      }
    }, 3000); // Scrolls every 3 seconds

    return () => clearInterval(intervalId);
  }, [isHovered]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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

        {/* Carousel Container */}
        <div 
          className="relative -mx-4 px-4 sm:mx-0 sm:px-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform hover:scale-110 active:scale-95 sm:-left-6"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg transition-transform hover:scale-110 active:scale-95 sm:-right-6"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Scrollable track */}
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
          >
            {galleryItems.map((item, index) => (
              <motion.div
                key={item.src}
                className="shrink-0 w-[260px] snap-center sm:snap-start"
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
