import ServicesHeader from '@/components/public/ServicesHeader';
import ServicesGrid from '@/components/public/ServicesGrid';
import ServicesCta from '@/components/public/ServicesCta';
import MediaBubble from '@/components/shared/MediaBubble';

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Bubbles (scattered) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden z-20">
        <div className="pointer-events-auto">
          <MediaBubble 
            src="/media/images/work-4.jpeg" 
            type="image" 
            size={180} 
            className="absolute top-40 -left-10 opacity-60 hover:opacity-100"
            delay={0.5}
            yOffset={15}
          />
          <MediaBubble 
            src="/media/images/work-5.jpeg" 
            type="image" 
            size={140} 
            className="absolute top-96 right-10 opacity-60 hover:opacity-100"
            delay={1.2}
            yOffset={25}
          />
          <MediaBubble 
            src="/media/videos/video-2.mp4" 
            type="video" 
            size={160} 
            className="absolute top-[800px] left-12 opacity-60 hover:opacity-100"
            delay={2.1}
            yOffset={20}
          />
          <MediaBubble 
            src="/media/images/work-6.jpeg" 
            type="image" 
            size={200} 
            className="absolute top-[1200px] right-4 opacity-60 hover:opacity-100"
            delay={0.8}
            yOffset={10}
          />
        </div>
      </div>

      <div className="relative z-10">
        <ServicesHeader />
        <ServicesGrid />
        <ServicesCta />
      </div>
    </main>
  );
}
