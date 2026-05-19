"use client"

import { Zap, Plug, CircuitBoard, Lightbulb, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { trackEvent, EVENTS } from "@/lib/analytics"

const services = [
  {
    id: "panel-upgrades",
    icon: CircuitBoard,
    title: "Panel Upgrades",
    description: "Modernize your electrical panel to handle today's power demands safely.",
    price: "$1,800 - $2,500",
  },
  {
    id: "outlet-switch-repair",
    icon: Plug,
    title: "Outlet & Switch Repair",
    description: "Fix faulty outlets, sparking switches, and worn receptacles.",
    price: "$125 - $175",
  },
  {
    id: "breaker-issues",
    icon: Zap,
    title: "Breaker Issues",
    description: "Diagnose and replace tripping breakers and faulty circuits.",
    price: "$150 - $250",
  },
  {
    id: "lighting-installation",
    icon: Lightbulb,
    title: "Lighting Installation",
    description: "Install fixtures, dimmers, and smart lighting systems.",
    price: "Quote Required",
  },
  {
    id: "surge-protection",
    icon: ShieldCheck,
    title: "Surge Protection",
    description: "Whole-home surge protection to safeguard your electronics.",
    price: "$350 - $500",
  },
  {
    id: "emergency-troubleshooting",
    icon: AlertTriangle,
    title: "Emergency Troubleshooting",
    description: "24/7 emergency diagnosis for power outages and electrical hazards.",
    price: "$89 diagnostic",
  },
]

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
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 animate-fade-in-up">
            Our Services
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            From minor repairs to major upgrades, our licensed electricians handle it all.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.id}
              className="bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer animate-float-in"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => handleServiceClick(service.id)}
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
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
          ))}
        </div>
      </div>
    </section>
  )
}
