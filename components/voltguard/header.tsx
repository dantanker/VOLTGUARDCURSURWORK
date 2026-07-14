"use client"

import { useState, type CSSProperties } from "react"
import clsx from "clsx"
import { Menu, Phone, X } from "lucide-react"
import Image from "next/image"
import { Navigation } from "@/components/Navigation"
import { QuoteCtaButton } from "./quote-cta-button"
import { PHONE_NUMBER, PHONE_LINK } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { SpotlightButtonLabel } from "@/components/SpotlightButton"

const navItems = [
  { label: "Why Us", href: "#why-us" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Locations", href: "#service-area" },
  { label: "FAQs", href: "#faq" },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handlePhoneClick = () => {
    trackEvent(EVENTS.PHONE_LINK_CLICK, { location: "header" })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/75 via-black/45 to-transparent pb-3 pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.85))]">
        <div className="flex items-center justify-between h-auto py-2 gap-2 sm:gap-4">
          {/* Logo — compact on mobile, unchanged on desktop */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center group shrink-0 [filter:drop-shadow(0_2px_10px_rgba(0,0,0,0.9))]"
            aria-label="VoltGuard — go to top"
          >
            <Image
              src="/voltguard-logo-white-no-tagline.png"
              alt="VoltGuard Electrical"
              width={420}
              height={128}
              className="h-12 w-auto object-contain sm:h-14 md:h-32"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <Navigation
            as="nav"
            className="hidden md:block relative mx-auto rounded-2xl bg-white/10 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.65)] backdrop-blur-sm"
            aria-label="Main navigation"
          >
            {({ ready, size, position, duration }) => (
              <div className="relative">
                <div
                  style={
                    {
                      "--size": `${size}px`,
                      "--position": `${position}px`,
                      "--duration": duration,
                    } as CSSProperties
                  }
                  className={clsx(
                    { hidden: !ready },
                    "absolute inset-y-0 left-0 h-full w-[length:var(--size)] translate-x-[length:var(--position)] rounded-lg bg-white/10 transition-[width,transform] duration-[var(--duration)]"
                  )}
                />

                <Navigation.List as="ul" className="relative flex items-center gap-1">
                  {navItems.map((item) => (
                    <Navigation.Item
                      key={item.href}
                      as="li"
                      onActivated={() => handleNavClick(item.href)}
                    >
                      {({ setActive, isActive }) => (
                        <button
                          type="button"
                          onClick={setActive}
                          className={clsx(
                            isActive ? "text-white" : "text-white/70 hover:text-white",
                            "inline-block px-4 py-1.5 text-sm font-medium transition-colors [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]"
                          )}
                        >
                          {item.label}
                        </button>
                      )}
                    </Navigation.Item>
                  ))}
                </Navigation.List>
              </div>
            )}
          </Navigation>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <a
              href={PHONE_LINK}
              onClick={handlePhoneClick}
              className="text-white font-medium whitespace-nowrap [text-shadow:0_2px_10px_rgba(0,0,0,0.95)] transition-colors hover:text-orange-200"
            >
              {PHONE_NUMBER}
            </a>
            <div className="[filter:drop-shadow(0_4px_14px_rgba(0,0,0,0.85))]">
              <QuoteCtaButton location="header" className="px-6" />
            </div>
          </div>

          {/* Mobile: Call + Quote always visible */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <a
              href={PHONE_LINK}
              onClick={handlePhoneClick}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.9))]"
              aria-label={`Call ${PHONE_NUMBER}`}
            >
              <Phone className="h-5 w-5" />
            </a>
            <div className="[filter:drop-shadow(0_4px_14px_rgba(0,0,0,0.85))]">
              <QuoteCtaButton
                location="header-mobile"
                className="h-11 px-3 py-2"
              >
                <SpotlightButtonLabel className="text-sm">Quote</SpotlightButtonLabel>
              </QuoteCtaButton>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-11 min-w-11 items-center justify-center text-white hover:text-white transition-colors [filter:drop-shadow(0_2px_8px_rgba(0,0,0,0.9))]"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <Navigation
              as="nav"
              className="relative mx-auto rounded-2xl bg-white/5 p-1.5 mb-4"
              aria-label="Mobile navigation"
            >
              {({ ready, size, position, duration }) => (
                <div className="relative">
                  <div
                    style={
                      {
                        "--size": `${size}px`,
                        "--position": `${position}px`,
                        "--duration": duration,
                      } as CSSProperties
                    }
                    className={clsx(
                      { hidden: !ready },
                      "absolute inset-y-0 left-0 h-full w-[length:var(--size)] translate-x-[length:var(--position)] rounded-lg bg-white/10 transition-[width,transform] duration-[var(--duration)]"
                    )}
                  />

                  <Navigation.List as="ul" className="relative flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Navigation.Item
                        key={item.href}
                        as="li"
                        onActivated={() => handleNavClick(item.href)}
                      >
                        {({ setActive, isActive }) => (
                          <button
                            type="button"
                            onClick={setActive}
                            className={clsx(
                              isActive ? "text-white" : "text-white/60 hover:text-white",
                              "inline-block w-full text-left px-4 py-3 text-base font-medium transition-colors min-h-11"
                            )}
                          >
                            {item.label}
                          </button>
                        )}
                      </Navigation.Item>
                    ))}
                  </Navigation.List>
                </div>
              )}
            </Navigation>

            <div className="flex flex-col gap-3 pt-4 border-t border-white/20">
              <a
                href={PHONE_LINK}
                onClick={handlePhoneClick}
                className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base font-medium text-white"
              >
                <Phone className="h-4 w-4" />
                Call {PHONE_NUMBER}
              </a>
              <QuoteCtaButton
                location="header-mobile-menu"
                fullWidth
                onAfterClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
