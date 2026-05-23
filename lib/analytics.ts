type AnalyticsEvent = {
  event: string
  properties?: Record<string, unknown>
  timestamp: Date
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  const analyticsEvent: AnalyticsEvent = {
    event,
    properties,
    timestamp: new Date(),
  }

  console.log(
    "%c[VoltGuard Analytics]",
    "background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;",
    event,
    properties || ""
  )

  return analyticsEvent
}

export const EVENTS = {
  CTA_CLICK: "cta_click",
  FORM_FIELD_FOCUS: "form_field_focus",
  FORM_FIELD_COMPLETE: "form_field_complete",
  FORM_VALIDATION_ERROR: "form_validation_error",
  FORM_SUBMIT_ATTEMPT: "form_submit_attempt",
  FORM_SUBMIT_SUCCESS: "form_submit_success",
  PHONE_LINK_CLICK: "phone_link_click",
  SERVICE_CARD_CLICK: "service_card_click",
  FAQ_EXPAND: "faq_expand",
} as const
