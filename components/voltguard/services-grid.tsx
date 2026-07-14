"use client"

import { ServicesArcGallery } from "./services-arc-gallery"
import { ServicesMobileCarousel } from "./services-mobile-carousel"
import { ShinyHeading } from "@/components/ShinyText"
import { FadeInUp } from "@/lib/scroll-animations"

export function ServicesGrid() {
  return (
    <section
      id="services"
      className="relative scroll-mt-24 md:scroll-mt-40 overflow-hidden"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-5 pb-2 md:pb-3">
        <div className="text-center">
          <FadeInUp delay={0}>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500 mb-2">
              What We Do
            </p>
            <h2 className="mb-3">
              <ShinyHeading
                text="Our Services"
                className="text-3xl sm:text-4xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
              Explore our complete range of electrical solutions.
            </p>
          </FadeInUp>
        </div>
      </div>

      {/* Mobile: stable peek carousel */}
      <div className="relative z-10 md:hidden pb-2">
        <ServicesMobileCarousel />
      </div>

      {/* Desktop: original arc gallery */}
      <div className="relative z-10 hidden md:block w-full h-[480px]">
        <ServicesArcGallery />
      </div>
    </section>
  )
}
