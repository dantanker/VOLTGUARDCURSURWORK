import { Shield, BadgeCheck, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LeadCaptureForm } from "./lead-capture-form"

export function HeroSection() {
  return (
    <section className="bg-slate-900 pt-4 pb-12 md:pt-8 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Badge */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0ms" }}>
              <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
                <Clock className="w-3 h-3 mr-1" />
                24/7 Emergency Response
              </Badge>
            </div>

            {/* Headline */}
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
                {"Chicago's Most Trusted Emergency Electricians"}
              </h1>
            </div>

            {/* Subheadline */}
            <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Fast, transparent, licensed. {"We'll"} have power restored before you finish your coffee.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="animate-fade-in-up flex flex-wrap gap-4 pt-2" style={{ animationDelay: "300ms" }}>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">Background-Checked</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-xs font-bold">$</span>
                </div>
                <span className="text-sm font-medium">Flat-Rate Pricing</span>
              </div>
            </div>

            {/* Social Proof Stat */}
            <div className="pt-4 hidden lg:block animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">2,847 Chicago families</span> served this year
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2 animate-slide-in-right" style={{ animationDelay: "200ms" }}>
            <LeadCaptureForm />
          </div>
        </div>
      </div>
    </section>
  )
}

