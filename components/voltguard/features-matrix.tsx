import { Clock, Shield, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { DIAGNOSTIC_FEE } from "@/lib/constants"
import { FadeInUp, WaveItem } from "@/lib/scroll-animations"

const features = [
  {
    icon: Clock,
    title: "42-Minute Average Response",
    description: "We know every minute counts. Our dispatchers prioritize by urgency.",
  },
  {
    icon: Shield,
    title: "Fully Licensed & Insured",
    description: "All technicians are background-checked and carry full liability coverage.",
  },
  {
    icon: DollarSign,
    title: "No Surprise Bills",
    description: `You'll know the exact cost before we start. Diagnostic fee: $${DIAGNOSTIC_FEE}.`,
  },
]

export function FeaturesMatrix() {
  return (
    <section id="why-us" className="bg-slate-50 py-16 md:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeInUp delay={0}>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Why Chicago Homeowners Choose VoltGuard
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-600 max-w-2xl mx-auto">
              When the lights go out, you need someone you can trust. {"Here's"} what sets us apart.
            </p>
          </FadeInUp>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <WaveItem key={feature.title} index={index} delay={0.15}>
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all h-full">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-700 transition-colors">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </WaveItem>
          ))}
        </div>
      </div>
    </section>
  )
}
