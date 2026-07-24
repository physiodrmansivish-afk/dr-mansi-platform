import HeroSection from '@/components/public/HeroSection';
import TrustStatsBar from '@/components/public/TrustStatsBar';
import WorkGallerySection from '@/components/public/WorkGallerySection';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import ServicesSection from '@/components/public/ServicesSection';
import WhyChooseUsSection from '@/components/public/WhyChooseUsSection';
import CtaSection from '@/components/public/CtaSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStatsBar />
      <WorkGallerySection />
      <TestimonialsSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <CtaSection />
    </>
  );
}
