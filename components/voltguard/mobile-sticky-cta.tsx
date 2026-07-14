"use client"

import { Phone } from "lucide-react"
import {
  SpotlightButton,
  SpotlightButtonLabel,
} from "@/components/SpotlightButton"
import { PHONE_NUMBER, PHONE_LINK } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { QuoteCtaButton } from "./quote-cta-button"
import { useQuoteModal } from "./quote-modal-provider"

/** Persistent Call + Quote bar for phones only; desktop unchanged. */
export function MobileStickyCta() {
  const { isQuoteModalOpen } = useQuoteModal()

  const handlePhoneClick = () => {
    trackEvent(EVENTS.PHONE_LINK_CLICK, { location: "mobile-sticky" })
  }

  if (isQuoteModalOpen) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-md"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-2 px-4 pt-3">
        <SpotlightButton
          href={PHONE_LINK}
          onClick={handlePhoneClick}
          className="h-12 flex-1 px-3 py-2"
        >
          <Phone className="h-4 w-4 text-white shrink-0" />
          <SpotlightButtonLabel className="text-sm">Call</SpotlightButtonLabel>
        </SpotlightButton>
        <QuoteCtaButton
          location="mobile-sticky"
          className="h-12 flex-1 px-3 py-2"
        >
          <SpotlightButtonLabel className="text-sm">Free Quote</SpotlightButtonLabel>
        </QuoteCtaButton>
      </div>
    </div>
  )
}
