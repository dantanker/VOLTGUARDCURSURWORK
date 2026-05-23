"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PHONE_NUMBER } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"

const navItems = [
  { label: "Why Us", href: "#why-us" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faq" },
]

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
    window.scrollTo({ top: 0, behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
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
        <div className="flex items-center justify-between h-auto md:h-auto py-3 md:py-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center group"
            aria-label="VoltGuard — go to top"
          >
            <Image
              src="/voltguard-logo-white-no-tagline.png"
              alt="VoltGuard Electrical"
              width={420}
              height={128}
              className="h-28 w-auto object-contain"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-slate-300 hover:text-white transition-colors font-medium text-sm"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <span className="text-slate-300 font-medium">
              {PHONE_NUMBER}
            </span>
            <Button 
              onClick={scrollToForm}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
            >
              Book Now
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
            <nav className="flex flex-col gap-2 mb-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-slate-300 hover:text-white transition-colors font-medium py-2 text-left"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
              <span className="text-slate-300 font-medium text-center py-2">
                Call: {PHONE_NUMBER}
              </span>
              <Button 
                onClick={scrollToForm}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold w-full"
              >
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
