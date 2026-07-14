import { ShinyHeading } from "@/components/ShinyText"
import { ShieldMap } from "@/components/voltguard/shield-map"
import {
  ServiceAreaCards,
  ServiceAreaMobileCard,
} from "@/components/voltguard/service-area-cards"
import { FadeInUp, SlideInLeft, SlideInRight } from "@/lib/scroll-animations"

export function ServiceAreaSection() {
  return (
    <section id="service-area" className="relative scroll-mt-24 md:scroll-mt-40 pt-0 md:pt-2 pb-6 md:pb-8 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(37,99,235,0.18), transparent 70%), radial-gradient(ellipse 50% 40% at 85% 40%, rgba(249,115,22,0.12), transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5 md:mb-6">
          <FadeInUp delay={0}>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500 mb-2">
              VoltGuard Protected
            </p>
            <h2 className="mb-4">
              <ShinyHeading
                text="Our Service Area"
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">
              Trusted electrical service across Chicago&apos;s northwest suburbs where our
              shield of protection covers your home and business.
            </p>
          </FadeInUp>
        </div>

        {/* Mobile: simple map + one info card */}
        <div className="space-y-5 lg:hidden">
          <FadeInUp delay={0.12}>
            <ShieldMap variant="simple" />
          </FadeInUp>
          <FadeInUp delay={0.18}>
            <ServiceAreaMobileCard />
          </FadeInUp>
        </div>

        {/* Desktop: cards carousel + shield map */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <SlideInLeft delay={0.15}>
            <div className="min-w-0 w-full">
              <ServiceAreaCards />
            </div>
          </SlideInLeft>

          <SlideInRight delay={0.2}>
            <div className="min-w-0 w-full flex justify-center lg:justify-end">
              <ShieldMap variant="shield" />
            </div>
          </SlideInRight>
        </div>
      </div>
    </section>
  )
}
