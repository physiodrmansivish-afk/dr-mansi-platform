'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import Image from 'next/image';

interface MediaLightboxProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  type: 'image' | 'video';
  alt?: string;
}

export default function MediaLightbox({ isOpen, onOpenChange, src, type, alt }: MediaLightboxProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 outline-none">
          <div className="relative mx-auto w-full overflow-hidden rounded-lg bg-black/50 p-2 sm:p-4">
            <Dialog.Close className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 focus:outline-none">
              <X className="h-5 w-5" />
            </Dialog.Close>
            
            <div className="relative flex aspect-video w-full items-center justify-center">
              {type === 'image' ? (
                <img
                  src={src}
                  alt={alt || 'Media content'}
                  className="max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={src}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full object-contain"
                />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
