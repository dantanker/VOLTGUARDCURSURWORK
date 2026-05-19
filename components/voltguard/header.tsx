"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Zap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PHONE_NUMBER, PHONE_LINK } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToForm = () => {
    trackEvent(EVENTS.CTA_CLICK, { location: "header" })
    const formElement = document.getElementById("hero-form")
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  const handlePhoneClick = () => {
    trackEvent(EVENTS.PHONE_LINK_CLICK, { location: "header" })
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-slate-900/95 backdrop-blur-sm shadow-lg" 
          : "bg-slate-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg group-hover:bg-orange-600 transition-colors">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">VoltGuard</span>
              <span className="text-xs text-slate-400 leading-tight hidden sm:block">Electrical Services</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href={PHONE_LINK}
              onClick={handlePhoneClick}
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              {PHONE_NUMBER}
            </a>
            <Button 
              onClick={scrollToForm}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
            >
              Book Emergency Service
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-4">
              <a 
                href={PHONE_LINK}
                onClick={handlePhoneClick}
                className="text-slate-300 hover:text-white transition-colors font-medium text-center py-2"
              >
                Call: {PHONE_NUMBER}
              </a>
              <Button 
                onClick={scrollToForm}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full"
              >
                Book Emergency Service
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
