import { Shield } from "lucide-react"
import { QuoteCtaButton } from "./quote-cta-button"
import { HeroHeadline } from "./hero-headline"
import { PartnerMarquee } from "./partner-marquee"
import { FadeInUp } from "@/lib/scroll-animations"
import { SITE_SUBHEADLINE } from "@/lib/constants"

export function HeroSection() {
  return (
    <section
      className="pt-24 pb-28 sm:pt-28 md:pt-40 md:pb-28 bg-cover bg-top bg-no-repeat relative min-h-[100svh] flex items-center md:bg-fixed"
      style={{
        backgroundImage:
          "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/voltguard-dining-lights.jpg-NZWgi2FngoerMeUntpgXL0mqKOpqa6.png)",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pb-16 md:pb-0">
        <div className="max-w-3xl space-y-5 sm:space-y-6">
          <HeroHeadline />

          <FadeInUp delay={0.1}>
            <p className="text-base sm:text-base md:text-lg lg:text-xl text-slate-100 leading-relaxed max-w-[22rem] sm:max-w-none md:whitespace-nowrap">
              {SITE_SUBHEADLINE}
            </p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="flex flex-col items-start gap-4 sm:gap-5">
              <QuoteCtaButton
                location="hero"
                className="h-12 w-full max-w-xs px-6 text-base sm:h-14 sm:w-auto sm:px-8 sm:text-lg"
              />
              <a
                href="#licenses"
                className="group inline-flex max-w-xs items-start gap-2.5 text-left transition-colors sm:max-w-none"
              >
                <Shield
                  className="mt-0.5 h-4 w-4 shrink-0 text-orange-400 [filter:drop-shadow(0_2px_6px_rgba(0,0,0,0.8))]"
                  aria-hidden
                />
                <span className="flex flex-col gap-1 [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
                  <span className="text-sm font-medium leading-snug tracking-wide text-slate-100 group-hover:text-white">
                    Licensed · Bonded · Insured
                  </span>
                  <span className="text-xs font-normal tracking-wide text-slate-300/90 group-hover:text-slate-200">
                    Illinois EC-2847193
                  </span>
                </span>
              </a>
            </div>
          </FadeInUp>
        </div>
      </div>

      <PartnerMarquee />
    </section>
  )
}
