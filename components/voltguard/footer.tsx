"use client"

import { Clock, MapPin, Phone, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  SpotlightButton,
  SpotlightButtonLabel,
} from "@/components/SpotlightButton"
import { PartnerMarqueeInline } from "./partner-marquee"
import { QuoteCtaButton } from "./quote-cta-button"
import {
  PHONE_NUMBER,
  PHONE_LINK,
  BUSINESS_HOURS,
  SITE_HEADLINE,
  SITE_SUBHEADLINE,
  FOOTER_NAV_LINKS,
  FOOTER_LICENSES,
  SHOP_ADDRESS,
  SOCIAL_LINKS,
} from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"

function SocialIcon({ label }: { label: string }) {
  const shared = "h-3.5 w-3.5"

  switch (label) {
    case "Google":
      return (
        <svg className={shared} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      )
    case "Yelp":
      return (
        <svg className={shared} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.271 15.068l-2.45 7.038a.588.588 0 0 1-1.101-.151l.957-3.294-2.063-1.19a.588.588 0 0 1 .303-1.089l7.228-1.043 2.127-6.127a.588.588 0 0 1 1.101.151l-.957 3.294 2.063 1.19a.588.588 0 0 1-.303 1.089l-7.228 1.043-2.127 6.127z" />
        </svg>
      )
    case "Facebook":
      return (
        <svg className={shared} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case "Instagram":
      return (
        <svg className={shared} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    case "LinkedIn":
      return (
        <svg className={shared} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case "Nextdoor":
      return (
        <svg className={shared} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.05 14.25l-3.2-3.2 1.414-1.414 1.786 1.786 4.586-4.586 1.414 1.414-6 6z" />
        </svg>
      )
    default:
      return null
  }
}

function FooterNavLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className = "text-xs text-slate-400 transition-colors hover:text-orange-300"

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export function Footer() {
  const handlePhoneClick = () => {
    trackEvent(EVENTS.PHONE_LINK_CLICK, { location: "footer" })
  }

  const handleSocialClick = (platform: string) => {
    trackEvent(EVENTS.CTA_CLICK, { location: "footer-social", platform })
  }

  return (
    <>
      <div className="relative z-10 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <SpotlightButton
              href={PHONE_LINK}
              onClick={handlePhoneClick}
              className="h-12 px-6 w-full sm:h-10 sm:w-auto"
            >
              <Phone className="h-4 w-4 text-white" />
              <SpotlightButtonLabel className="text-base">
                Call {PHONE_NUMBER}
              </SpotlightButtonLabel>
            </SpotlightButton>
            <QuoteCtaButton location="footer" className="h-12 px-6 w-full sm:h-10 sm:w-auto" />
          </div>
        </div>
      </div>

      <footer id="contact" className="relative z-10 scroll-mt-24 md:scroll-mt-40 pt-5 pb-24 md:pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-slate-800 pb-5 mb-5">
            <PartnerMarqueeInline />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4 mb-4">
            <div className="col-span-2 lg:col-span-1">
              <Image
                src="/voltguard-logo-white-no-tagline.png"
                alt="VoltGuard Electrical"
                width={240}
                height={72}
                className="h-11 w-auto object-contain mb-2"
              />
              <p className="text-sm font-semibold text-white mb-0.5">{SITE_HEADLINE}</p>
              <p className="text-xs text-slate-400 leading-snug mb-0 max-w-[220px]">
                {SITE_SUBHEADLINE}
              </p>
              <div className="mt-5 flex flex-wrap gap-1">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    onClick={() => handleSocialClick(social.shortLabel)}
                    className="flex h-10 w-10 md:h-7 md:w-7 items-center justify-center rounded border border-slate-700/80 bg-slate-800/60 text-slate-400 transition-colors hover:border-orange-500/40 hover:text-orange-300"
                  >
                    <SocialIcon label={social.shortLabel} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Company
              </h3>
              <ul className="space-y-1.5">
                {FOOTER_NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <FooterNavLink
                      href={link.href}
                      label={link.label}
                      external={"external" in link ? link.external : false}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-orange-400" />
                Location
              </h3>
              <address className="not-italic text-xs text-slate-400 leading-snug">
                <a
                  href={SHOP_ADDRESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-orange-300"
                >
                  {SHOP_ADDRESS.street}
                  <br />
                  {SHOP_ADDRESS.city}, {SHOP_ADDRESS.state} {SHOP_ADDRESS.zip}
                </a>
              </address>
              <p className="mt-2 text-[11px] text-slate-500 flex items-start gap-1">
                <Clock className="h-3 w-3 shrink-0 text-blue-400 mt-0.5" />
                <span>
                  {BUSINESS_HOURS}
                  <br />
                  Mon–Sat 7 AM – 9 PM
                </span>
              </p>
            </div>

            <div id="licenses" className="scroll-mt-24 md:scroll-mt-40">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1">
                <Shield className="h-3 w-3 text-orange-400" />
                Licenses
              </h3>
              <p className="mb-2 text-xs font-medium text-orange-300/90">
                Fully licensed electrical contractor
              </p>
              <ul className="space-y-1.5">
                {FOOTER_LICENSES.map((license) => (
                  <li key={license.label} className="text-[11px]">
                    <p className="text-slate-500">{license.label}</p>
                    <p className="font-mono text-slate-300">{license.number}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-800 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-500">
              &copy; {new Date().getFullYear()} VoltGuard Electrical · {SHOP_ADDRESS.full}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-300 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
