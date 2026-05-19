"use client"

import { Phone, Clock, MapPin, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvailabilityCounter } from "./availability-counter"
import { PHONE_NUMBER, PHONE_LINK, SERVICE_AREA_CITIES, BUSINESS_HOURS } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"

export function Footer() {
  const handlePhoneClick = () => {
    trackEvent(EVENTS.PHONE_LINK_CLICK, { location: "footer" })
  }

  const scrollToForm = () => {
    trackEvent(EVENTS.CTA_CLICK, { location: "footer" })
    const formElement = document.getElementById("hero-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-slate-900 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="text-center mb-12 pb-12 border-b border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Get Your Power Back?
          </h2>
          <p className="text-slate-400 mb-6">
            {"Don't"} wait for a small problem to become a big one.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold h-14 px-8 text-lg w-full sm:w-auto"
            >
              <a href={PHONE_LINK} onClick={handlePhoneClick}>
                <Phone className="w-5 h-5 mr-2" />
                Call {PHONE_NUMBER}
              </a>
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={scrollToForm}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white h-14 px-8 text-lg w-full sm:w-auto"
            >
              Book Online
            </Button>
          </div>

          {/* Availability Counter */}
          <div className="flex justify-center mt-6">
            <AvailabilityCounter />
          </div>

          {/* Live Dispatch Status */}
          <p className="text-slate-500 text-sm mt-4">
            Live Dispatch Status: <span className="text-slate-300">42 minutes</span> average response
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">VoltGuard</span>
                <span className="text-xs text-slate-400 leading-tight">Electrical Services</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {"Chicago's"} trusted emergency electrical service. Licensed, insured, and ready when you need us most.
            </p>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Service Area
            </h3>
            <ul className="text-slate-400 text-sm space-y-2">
              {SERVICE_AREA_CITIES.map((city) => (
                <li key={city}>{city}</li>
              ))}
              <li className="text-slate-500">& surrounding areas</li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Hours
            </h3>
            <p className="text-slate-400 text-sm mb-2">{BUSINESS_HOURS}</p>
            <p className="text-slate-500 text-sm">
              Emergency calls answered immediately.
              <br />
              Standard appointments: Mon-Sat 7AM-9PM
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} VoltGuard Electrical Services. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
