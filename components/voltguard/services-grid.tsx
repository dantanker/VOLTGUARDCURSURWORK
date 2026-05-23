"use client"

import { Zap, Plug, CircuitBoard, Lightbulb, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { RotateIn } from "@/lib/scroll-animations"
import { SERVICES } from "@/lib/constants"
import Image from "next/image"

export function ServicesGrid() {
  const handleServiceClick = (serviceId: string) => {
    trackEvent(EVENTS.SERVICE_CARD_CLICK, { service: serviceId })
    const formElement = document.getElementById("hero-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="services" className="bg-white py-16 md:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Our Services
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            From minor repairs to major upgrades, our licensed electricians handle it all.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <RotateIn key={service.id} delay={index * 0.08}>
              <Card 
                className="bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer h-full overflow-hidden"
                onClick={() => handleServiceClick(service.id)}
              >
                {/* Service Image */}
                {service.image && (
                  <div className="relative w-full h-48 -mx-0 -mt-0 mb-3">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
                
                <CardContent className="pt-3">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">
                      {service.price}
                    </span>
                    <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Book this service
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </RotateIn>
          ))}
        </div>
      </div>
    </section>
  )
}
