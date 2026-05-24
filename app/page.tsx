import { Header } from "@/components/voltguard/header"
import { HeroSection } from "@/components/voltguard/hero-section"
import { FeaturesMatrix } from "@/components/voltguard/features-matrix"
import { SocialProof } from "@/components/voltguard/social-proof"
import { ServiceAreaSection } from "@/components/voltguard/service-area-section"
import { ServicesGrid } from "@/components/voltguard/services-grid"
import { GallerySection } from "@/components/voltguard/gallery-section"
import { FAQSection } from "@/components/voltguard/faq-section"
import { Footer } from "@/components/voltguard/footer"
import { AnimatedDarkBackground } from "@/components/AnimatedDarkBackground"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <AnimatedDarkBackground />
      <Header />
      <main className="relative z-10">
        <HeroSection />
        <FeaturesMatrix />
        <ServicesGrid />
        <GallerySection />
        <SocialProof />
        <ServiceAreaSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
