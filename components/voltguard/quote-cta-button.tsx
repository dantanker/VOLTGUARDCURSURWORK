"use client"

import type { ReactNode } from "react"
import {
  SpotlightButton,
  SpotlightButtonLabel,
} from "@/components/SpotlightButton"
import { CTA_LABEL } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useQuoteModal } from "./quote-modal-provider"

type QuoteCtaButtonProps = {
  location: string
  className?: string
  fullWidth?: boolean
  onAfterClick?: () => void
  children?: ReactNode
}

export function QuoteCtaButton({
  location,
  className,
  fullWidth = false,
  onAfterClick,
  children,
}: QuoteCtaButtonProps) {
  const { openQuoteModal } = useQuoteModal()

  const handleClick = () => {
    openQuoteModal(location)
    onAfterClick?.()
  }

  return (
    <SpotlightButton
      onClick={handleClick}
      className={cn(fullWidth && "w-full", className)}
    >
      {children ?? <SpotlightButtonLabel>{CTA_LABEL}</SpotlightButtonLabel>}
    </SpotlightButton>
  )
}
