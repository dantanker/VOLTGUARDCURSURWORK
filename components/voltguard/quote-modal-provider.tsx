"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react"
import {
  SpotlightButton,
  SpotlightButtonLabel,
} from "@/components/SpotlightButton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CTA_LABEL, SERVICES } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"
import {
  formatPhoneNumber,
  validatePhone,
  validateZipCode,
} from "@/lib/validation"
import { cn } from "@/lib/utils"

const SHIELD_CLIP_ID = "quote-modal-shield-clip"
const OTHER_SERVICE = "other"

type QuoteModalContextValue = {
  openQuoteModal: (location: string) => void
  isQuoteModalOpen: boolean
}

const QuoteModalContext = createContext<QuoteModalContextValue>({
  openQuoteModal: () => {},
  isQuoteModalOpen: false,
})

export function useQuoteModal() {
  return useContext(QuoteModalContext)
}

type FormState = {
  name: string
  phone: string
  zipCode: string
  service: string
  otherService: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

function ShieldBackdrop() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <clipPath id={SHIELD_CLIP_ID} clipPathUnits="objectBoundingBox">
          <path d="M 0.5 0.033 L 0.927 0.133 L 0.927 0.522 Q 0.927 0.772 0.5 0.939 Q 0.073 0.772 0.073 0.522 L 0.073 0.133 Z" />
        </clipPath>
        <linearGradient
          id="quoteShieldBorder"
          gradientUnits="userSpaceOnUse"
          x1="260"
          y1="22"
          x2="260"
          y2="648"
        >
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#f97316" />
          <animateTransform
            attributeName="gradientTransform"
            type="rotate"
            from="0 260 340"
            to="360 260 340"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </linearGradient>
        <linearGradient id="quoteShieldFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const SHIELD_PATH =
  "M 260 22 L 482 90 L 482 355 Q 482 525 260 648 Q 38 525 38 355 L 38 90 Z"

const labelClass =
  "block text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[10px]"

function FieldGroup({
  label,
  htmlFor,
  children,
  message,
  messageTone = "error",
  className,
}: {
  label: string
  htmlFor: string
  children: ReactNode
  message?: string
  messageTone?: "error" | "success"
  className?: string
}) {
  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {message ? (
        <p
          className={cn(
            "flex items-center justify-center gap-1 text-center text-xs leading-tight sm:text-[10px]",
            messageTone === "success" ? "text-green-400" : "text-red-400"
          )}
        >
          {messageTone === "error" ? (
            <AlertCircle className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" />
          ) : (
            <CheckCircle className="h-3.5 w-3.5 shrink-0 sm:h-3 sm:w-3" />
          )}
          {message}
        </p>
      ) : null}
    </div>
  )
}

function QuoteShieldForm({ onSuccess }: { onSuccess: (confirmation: string) => void }) {
  const formId = "quote-shield-form"
  const [formData, setFormData] = useState<FormState>({
    name: "",
    phone: "",
    zipCode: "",
    service: "",
    otherService: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateName = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return { valid: false as const }
    if (trimmed.length < 2) {
      return { valid: false as const, error: "Please enter your full name" }
    }
    return { valid: true as const }
  }

  const validateField = (field: keyof FormState, value: string, allData = formData) => {
    switch (field) {
      case "name": {
        const result = validateName(value)
        setErrors((prev) => ({
          ...prev,
          name: result.error,
        }))
        break
      }
      case "phone": {
        const result = validatePhone(value)
        setErrors((prev) => ({
          ...prev,
          phone: result.error,
        }))
        break
      }
      case "zipCode": {
        const result = validateZipCode(value)
        setErrors((prev) => ({
          ...prev,
          zipCode: result.error,
        }))
        break
      }
      case "service": {
        setErrors((prev) => ({
          ...prev,
          service: value ? undefined : "Please select a service",
        }))
        break
      }
      case "otherService": {
        if (allData.service !== OTHER_SERVICE) {
          setErrors((prev) => ({ ...prev, otherService: undefined }))
          break
        }
        const trimmed = value.trim()
        setErrors((prev) => ({
          ...prev,
          otherService:
            trimmed.length >= 3
              ? undefined
              : "Please describe the service you need",
        }))
        break
      }
    }
  }

  const handleChange = (field: keyof FormState, value: string) => {
    let processed = value
    if (field === "zipCode") {
      processed = value.replace(/\D/g, "").slice(0, 5)
    } else if (field === "phone") {
      processed = formatPhoneNumber(value)
    } else if (field === "otherService") {
      processed = value.slice(0, 120)
    }

    const next = { ...formData, [field]: processed }
    setFormData(next)

    if (touched[field] || processed.length > 0) {
      validateField(field, processed, next)
    }

    if (field === "service" && value !== OTHER_SERVICE) {
      setErrors((prev) => ({ ...prev, otherService: undefined }))
    }
  }

  const isFormValid = () => {
    const nameOk = validateName(formData.name).valid
    const phoneOk = validatePhone(formData.phone).valid
    const zipOk = validateZipCode(formData.zipCode).valid
    const serviceOk = Boolean(formData.service)
    const otherOk =
      formData.service !== OTHER_SERVICE || formData.otherService.trim().length >= 3
    return nameOk && phoneOk && zipOk && serviceOk && otherOk
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      name: true,
      phone: true,
      zipCode: true,
      service: true,
      otherService: true,
    })

    ;(["name", "phone", "zipCode", "service", "otherService"] as const).forEach(
      (field) => validateField(field, formData[field], formData)
    )

    if (!isFormValid()) {
      trackEvent(EVENTS.FORM_VALIDATION_ERROR, { form: "quote_modal" })
      return
    }

    setIsSubmitting(true)
    trackEvent(EVENTS.FORM_SUBMIT_ATTEMPT, {
      form: "quote_modal",
      service:
        formData.service === OTHER_SERVICE
          ? formData.otherService.trim()
          : formData.service,
    })

    await new Promise((resolve) => setTimeout(resolve, 1400))

    const confirmation = `VG-${Date.now().toString().slice(-8)}`
    trackEvent(EVENTS.FORM_SUBMIT_SUCCESS, {
      form: "quote_modal",
      confirmationNumber: confirmation,
    })

    setIsSubmitting(false)
    onSuccess(confirmation)
  }

  const fieldClass = (field: keyof FormState, success?: boolean) =>
    cn(
      "h-11 w-full rounded-md bg-slate-950/70 text-center text-base text-white sm:h-9 sm:text-sm",
      "border border-slate-600/70 placeholder:text-slate-500",
      "focus-visible:border-orange-500/70 focus-visible:ring-2 focus-visible:ring-orange-500/15",
      errors[field] && touched[field] && "border-red-500/70",
      success && "border-green-500/60"
    )

  const selectTriggerClass = (success?: boolean) =>
    cn(
      fieldClass("service", success),
      "relative justify-center [&>svg]:absolute [&>svg]:right-2.5 [&_[data-slot=select-value]]:line-clamp-1 [&_[data-slot=select-value]]:text-center"
    )

  const zipValid = validateZipCode(formData.zipCode).valid
  const phoneValid = validatePhone(formData.phone).valid

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-[340px]"
    >
      <FieldGroup
        label="Name"
        htmlFor="quote-name"
        message={errors.name && touched.name ? errors.name : undefined}
      >
        <Input
          id="quote-name"
          autoComplete="name"
          placeholder="John Smith"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onFocus={() => trackEvent(EVENTS.FORM_FIELD_FOCUS, { field: "name", form: "quote_modal" })}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, name: true }))
            validateField("name", formData.name)
          }}
          className={fieldClass("name", validateName(formData.name).valid)}
        />
      </FieldGroup>

      <div className="mt-2 flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_92px] sm:gap-2.5">
        <FieldGroup
          label="Phone Number"
          htmlFor="quote-phone"
          message={errors.phone && touched.phone ? errors.phone : undefined}
        >
          <Input
            id="quote-phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 555-5555"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            onFocus={() => trackEvent(EVENTS.FORM_FIELD_FOCUS, { field: "phone", form: "quote_modal" })}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, phone: true }))
              validateField("phone", formData.phone)
            }}
            className={fieldClass("phone", phoneValid)}
          />
        </FieldGroup>

        <FieldGroup
          label="ZIP Code"
          htmlFor="quote-zip"
          message={
            zipValid
              ? "In area"
              : errors.zipCode && touched.zipCode
                ? errors.zipCode
                : undefined
          }
          messageTone={zipValid ? "success" : "error"}
        >
          <Input
            id="quote-zip"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="60004"
            value={formData.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            onFocus={() => trackEvent(EVENTS.FORM_FIELD_FOCUS, { field: "zipCode", form: "quote_modal" })}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, zipCode: true }))
              validateField("zipCode", formData.zipCode)
            }}
            className={fieldClass("zipCode", zipValid)}
          />
        </FieldGroup>
      </div>

      <FieldGroup
        label="Service Needed"
        htmlFor="quote-service"
        message={errors.service && touched.service ? errors.service : undefined}
      >
        <Select
          value={formData.service}
          onValueChange={(value) => {
            handleChange("service", value)
            setTouched((prev) => ({ ...prev, service: true }))
          }}
        >
          <SelectTrigger
            id="quote-service"
            className={selectTriggerClass(Boolean(formData.service))}
          >
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent className="border-slate-700 bg-slate-900 text-white">
            {SERVICES.map((service) => (
              <SelectItem
                key={service.id}
                value={service.title}
                className="focus:bg-orange-500/15 focus:text-white"
              >
                {service.title}
              </SelectItem>
            ))}
            <SelectItem value={OTHER_SERVICE} className="focus:bg-orange-500/15 focus:text-white">
              Other
            </SelectItem>
          </SelectContent>
        </Select>
      </FieldGroup>

      {formData.service === OTHER_SERVICE && (
        <FieldGroup
          label="Describe Your Service"
          htmlFor="quote-other"
          message={
            errors.otherService && touched.otherService ? errors.otherService : undefined
          }
        >
          <Input
            id="quote-other"
            placeholder="Tell us what you need"
            value={formData.otherService}
            onChange={(e) => handleChange("otherService", e.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, otherService: true }))
              validateField("otherService", formData.otherService, formData)
            }}
            className={fieldClass(
              "otherService",
              formData.otherService.trim().length >= 3
            )}
          />
        </FieldGroup>
      )}

      <div className="flex flex-col items-center border-t border-slate-700/40 pt-2.5">
        <SpotlightButton
          type="submit"
          disabled={isSubmitting}
          className="w-full max-w-[280px] py-3 px-4 shadow-lg shadow-orange-500/20 sm:w-[240px] sm:py-2.5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <SpotlightButtonLabel className="text-sm">Sending...</SpotlightButtonLabel>
            </>
          ) : (
            <SpotlightButtonLabel className="text-sm">Request My Free Quote</SpotlightButtonLabel>
          )}
        </SpotlightButton>

        <p className="mt-2 text-center text-xs leading-snug text-slate-500 sm:mt-1.5 sm:text-[10px]">
          No credit card required · We&apos;ll call within 15 minutes
        </p>
      </div>
      </div>
    </form>
  )
}

function QuoteModalContent({
  open,
  onOpenChange,
  location,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: string
}) {
  const [submitted, setSubmitted] = useState(false)
  const [confirmation, setConfirmation] = useState("")

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setTimeout(() => {
        setSubmitted(false)
        setConfirmation("")
      }, 200)
    }
    onOpenChange(next)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[min(94vw,480px)] -translate-x-1/2 -translate-y-1/2",
            "border-0 bg-transparent p-0 shadow-none outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200"
          )}
          aria-describedby={undefined}
        >
          <ShieldBackdrop />

          <div className="relative mx-auto w-[min(94vw,480px)] aspect-[520/680]">
              <div
                className="pointer-events-none absolute inset-0 opacity-50 blur-2xl"
                style={{
                  clipPath: `url(#${SHIELD_CLIP_ID})`,
                  background:
                    "radial-gradient(ellipse at 50% 12%, rgba(249,115,22,0.35), transparent 55%), radial-gradient(ellipse at 50% 88%, rgba(37,99,235,0.25), transparent 60%)",
                }}
                aria-hidden
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{ clipPath: `url(#${SHIELD_CLIP_ID})` }}
              >
                <svg viewBox="0 0 520 680" className="absolute inset-0 h-full w-full" aria-hidden>
                  <path
                    d={SHIELD_PATH}
                    fill="url(#quoteShieldFill)"
                  />
                  <path
                    d={SHIELD_PATH}
                    fill="none"
                    stroke="url(#quoteShieldBorder)"
                    strokeWidth="7"
                    strokeLinejoin="round"
                    opacity="0.35"
                  />
                  <path
                    d={SHIELD_PATH}
                    fill="none"
                    stroke="url(#quoteShieldBorder)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div
                className="relative z-10 flex h-full flex-col overflow-hidden px-8 pb-11 pt-11 sm:px-10 sm:pb-12 sm:pt-12"
                style={{ clipPath: `url(#${SHIELD_CLIP_ID})` }}
              >
                <DialogPrimitive.Close className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-600/60 bg-slate-900/90 text-slate-300 transition-colors hover:border-orange-500/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/40 sm:right-4 sm:top-4 sm:h-auto sm:w-auto sm:p-1.5">
                  <X className="h-5 w-5 sm:h-4 sm:w-4" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>

                {!submitted ? (
                  <>
                    <div className="mb-5 mt-3 shrink-0 text-center sm:mt-4">
                      <DialogPrimitive.Title className="bg-gradient-to-b from-white to-slate-300 bg-clip-text text-xl font-bold text-transparent sm:text-xl">
                        {CTA_LABEL}
                      </DialogPrimitive.Title>
                      <p className="mx-auto mt-1.5 max-w-[260px] text-sm leading-relaxed text-slate-400 sm:text-xs">
                        Protected by VoltGuard — tell us what you need.
                      </p>
                      <div className="mx-auto mt-2.5 h-px w-14 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overscroll-contain pt-3 [scrollbar-width:thin] [scrollbar-color:rgba(249,115,22,0.35)_transparent]">
                      <QuoteShieldForm
                        onSuccess={(num) => {
                          setConfirmation(num)
                          setSubmitted(true)
                          trackEvent(EVENTS.FORM_SUBMIT_SUCCESS, {
                            form: "quote_modal",
                            location,
                            confirmationNumber: num,
                          })
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">You&apos;re covered!</h3>
                    <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-slate-300 sm:text-sm">
                      A VoltGuard technician will call you within 15 minutes with your free quote.
                    </p>
                    <div className="mt-4 rounded-xl border border-slate-700/70 bg-slate-950/60 px-4 py-2.5">
                      <p className="text-[10px] uppercase tracking-wide text-slate-500">Confirmation</p>
                      <p className="mt-0.5 text-base font-bold tracking-wide text-orange-400">
                        {confirmation}
                      </p>
                    </div>
                    <DialogPrimitive.Close className="mt-5 text-sm font-medium text-orange-400 transition-colors hover:text-orange-300">
                      Close
                    </DialogPrimitive.Close>
                  </div>
                )}
              </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [location, setLocation] = useState("unknown")

  const openQuoteModal = useCallback((ctaLocation: string) => {
    trackEvent(EVENTS.CTA_CLICK, { location: ctaLocation })
    setLocation(ctaLocation)
    setOpen(true)
  }, [])

  return (
    <QuoteModalContext.Provider value={{ openQuoteModal, isQuoteModalOpen: open }}>
      {children}
      <QuoteModalContent open={open} onOpenChange={setOpen} location={location} />
    </QuoteModalContext.Provider>
  )
}
