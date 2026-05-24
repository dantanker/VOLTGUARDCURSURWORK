import { ShinyHeading } from "@/components/ShinyText"
import { FadeInUp } from "@/lib/scroll-animations"
import { WhyUsAccordion } from "./why-us-accordion"

export function FeaturesMatrix() {
  return (
    <section id="why-us" className="relative py-16 md:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <FadeInUp delay={0}>
            <h2 className="mb-4">
              <ShinyHeading
                text="Why Chicago Chooses VoltGuard"
                className="text-2xl sm:text-3xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300 max-w-2xl mx-auto">
              From complex commercial grids to precision smart home upgrades, we don&apos;t
              just fix wiring. We future-proof your infrastructure,
            </p>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.15}>
          <div className="scroll-mt-20">
            <WhyUsAccordion />
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
