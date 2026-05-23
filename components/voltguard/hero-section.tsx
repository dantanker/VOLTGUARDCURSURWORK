import { Shield, BadgeCheck } from "lucide-react"
import { LeadCaptureForm } from "./lead-capture-form"
import { FadeInUp, SlideInRight } from "@/lib/scroll-animations"

export function HeroSection() {
  return (
    <section 
      className="pt-4 pb-12 md:pt-8 md:pb-20 bg-cover bg-center bg-no-repeat relative min-h-screen flex items-center"
      style={{
        backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/voltguard-dining-lights.jpg-NZWgi2FngoerMeUntpgXL0mqKOpqa6.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Headline */}
            <FadeInUp delay={0}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
                {"Chicago's Most Trusted Emergency Electricians"}
              </h1>
            </FadeInUp>

            {/* Subheadline */}
            <FadeInUp delay={0.1}>
              <p className="text-lg sm:text-xl text-slate-100 leading-relaxed max-w-2xl">
                Fast, transparent, licensed. {"We'll"} have power restored before you finish your coffee.
              </p>
            </FadeInUp>

            {/* Trust Badges */}
            <FadeInUp delay={0.2}>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-sm font-medium">Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 text-blue-300" />
                  </div>
                  <span className="text-sm font-medium">Background-Checked</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-blue-600/30 rounded-lg flex items-center justify-center">
                    <span className="text-blue-300 text-xs font-bold">$</span>
                  </div>
                  <span className="text-sm font-medium">Flat-Rate Pricing</span>
                </div>
              </div>
            </FadeInUp>

            {/* Social Proof Stat */}
            <FadeInUp delay={0.3}>
              <div className="pt-4 hidden lg:block">
                <p className="text-slate-300 text-sm">
                  <span className="text-white font-semibold">2,847 Chicago families</span> served this year
                </p>
              </div>
            </FadeInUp>
          </div>

          {/* Right Column - Form */}
          <SlideInRight delay={0.2}>
            <div className="w-full">
              <LeadCaptureForm />
            </div>
          </SlideInRight>
        </div>
      </div>
    </section>
  )
}

