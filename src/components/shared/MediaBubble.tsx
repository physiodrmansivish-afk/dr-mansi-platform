'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import MediaLightbox from './MediaLightbox';

interface MediaBubbleProps {
  src: string;
  type: 'image' | 'video';
  size?: number;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export default function MediaBubble({ 
  src, 
  type, 
  size = 120, 
  className = '',
  delay = 0,
  duration = 4,
  yOffset = 20
}: MediaBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        className={`absolute cursor-pointer overflow-hidden rounded-full border-4 border-white shadow-xl ${className}`}
        style={{ width: size, height: size }}
        whileHover={{ scale: 1.1, zIndex: 10 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 0 }}
        animate={{ y: [-yOffset, yOffset, -yOffset] }}
        transition={{ 
          repeat: Infinity, 
          duration: duration, 
          ease: "easeInOut",
          delay: delay 
        }}
        onClick={() => setIsOpen(true)}
      >
        {type === 'image' ? (
          <img
            src={src}
            alt="Work gallery"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="relative h-full w-full bg-gray-900">
            <video
              src={src}
              className="h-full w-full object-cover opacity-80"
              muted
              playsInline
              loop
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="h-8 w-8 text-white opacity-80" fill="currentColor" />
            </div>
          </div>
        )}
      </motion.div>

      <MediaLightbox 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
        src={src} 
        type={type} 
      />
    </>
  );
}
