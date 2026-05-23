import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PRICING_LIST, DIAGNOSTIC_FEE } from "@/lib/constants"
import { FadeInUp, SlideInLeft, SlideInRight, WaveItem } from "@/lib/scroll-animations"

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-16 md:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeInUp delay={0}>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Transparent, Flat-Rate Pricing
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-600 max-w-2xl mx-auto">
              No hidden fees. No overtime charges. Just honest work at honest prices.
            </p>
          </FadeInUp>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Diagnostic Fee Callout */}
          <SlideInLeft delay={0.2}>
            <Card className="bg-blue-600 border-0 text-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl font-bold">${DIAGNOSTIC_FEE}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Diagnostic Fee</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      Our thorough diagnostic identifies the root cause of your electrical issue. 
                      <span className="font-semibold text-white"> This fee is waived if you proceed with the repair.</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideInLeft>

          {/* Pricing List */}
          <SlideInRight delay={0.2}>
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Common Services
                </h3>
                <ul className="space-y-3">
                  {PRICING_LIST.map((item, index) => (
                    <WaveItem key={item.service} index={index} delay={0.08}>
                      <li className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700">{item.service}</span>
                        </div>
                        <span className="text-slate-900 font-medium">{item.price}</span>
                      </li>
                    </WaveItem>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </SlideInRight>
        </div>

        {/* Trust Callout */}
        <FadeInUp delay={0.4}>
          <p className="text-center text-slate-500 text-sm mt-8">
            All prices include labor and materials. No overtime charges, ever.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}
