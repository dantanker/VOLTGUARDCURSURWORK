"use client"

import { useState } from "react"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { 
  formatPhoneNumber, 
  validateZipCode, 
  validatePhone, 
  validateDescription 
} from "@/lib/validation"

interface FormState {
  zipCode: string
  phone: string
  issueDescription: string
}

interface FormErrors {
  zipCode?: string
  phone?: string
  issueDescription?: string
}

interface FormSuccess {
  zipCode?: boolean
  phone?: boolean
  issueDescription?: boolean
}

export function LeadCaptureForm() {
  const [formData, setFormData] = useState<FormState>({
    zipCode: "",
    phone: "",
    issueDescription: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState<FormSuccess>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [confirmationNumber, setConfirmationNumber] = useState("")
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleFocus = (field: string) => {
    trackEvent(EVENTS.FORM_FIELD_FOCUS, { field })
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, formData[field as keyof FormState])
  }

  const validateField = (field: string, value: string) => {
    let result: { valid: boolean; error?: string; inServiceArea?: boolean }
    
    switch (field) {
      case "zipCode":
        result = validateZipCode(value)
        if (result.valid && result.inServiceArea) {
          setSuccess(prev => ({ ...prev, zipCode: true }))
          setErrors(prev => ({ ...prev, zipCode: undefined }))
          trackEvent(EVENTS.FORM_FIELD_COMPLETE, { field: "zipCode", inServiceArea: true })
        } else if (result.error) {
          setErrors(prev => ({ ...prev, zipCode: result.error }))
          setSuccess(prev => ({ ...prev, zipCode: false }))
          trackEvent(EVENTS.FORM_VALIDATION_ERROR, { field: "zipCode", error: result.error })
        } else {
          setErrors(prev => ({ ...prev, zipCode: undefined }))
          setSuccess(prev => ({ ...prev, zipCode: false }))
        }
        break
        
      case "phone":
        result = validatePhone(value)
        if (result.valid) {
          setSuccess(prev => ({ ...prev, phone: true }))
          setErrors(prev => ({ ...prev, phone: undefined }))
          trackEvent(EVENTS.FORM_FIELD_COMPLETE, { field: "phone" })
        } else if (result.error) {
          setErrors(prev => ({ ...prev, phone: result.error }))
          setSuccess(prev => ({ ...prev, phone: false }))
        } else {
          setErrors(prev => ({ ...prev, phone: undefined }))
          setSuccess(prev => ({ ...prev, phone: false }))
        }
        break
        
      case "issueDescription":
        result = validateDescription(value)
        if (result.valid) {
          setSuccess(prev => ({ ...prev, issueDescription: true }))
          setErrors(prev => ({ ...prev, issueDescription: undefined }))
          trackEvent(EVENTS.FORM_FIELD_COMPLETE, { field: "issueDescription" })
        } else if (result.error && touched.issueDescription) {
          setErrors(prev => ({ ...prev, issueDescription: result.error }))
          setSuccess(prev => ({ ...prev, issueDescription: false }))
        } else {
          setErrors(prev => ({ ...prev, issueDescription: undefined }))
          setSuccess(prev => ({ ...prev, issueDescription: false }))
        }
        break
    }
  }

  const handleChange = (field: keyof FormState, value: string) => {
    let processedValue = value
    
    if (field === "zipCode") {
      processedValue = value.replace(/\D/g, "").slice(0, 5)
    } else if (field === "phone") {
      processedValue = formatPhoneNumber(value)
    } else if (field === "issueDescription") {
      processedValue = value.slice(0, 500)
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }))
    
    // Real-time validation
    if (touched[field] || processedValue.length > 0) {
      validateField(field, processedValue)
    }
  }

  const isFormValid = () => {
    return (
      success.zipCode && 
      success.phone && 
      success.issueDescription
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    trackEvent(EVENTS.FORM_SUBMIT_ATTEMPT, { formData })
    
    // Mark all fields as touched
    setTouched({ zipCode: true, phone: true, issueDescription: true })
    
    // Validate all fields
    validateField("zipCode", formData.zipCode)
    validateField("phone", formData.phone)
    validateField("issueDescription", formData.issueDescription)
    
    if (!isFormValid()) {
      trackEvent(EVENTS.FORM_VALIDATION_ERROR, { errors })
      return
    }
    
    setIsSubmitting(true)
    
    // Mock submission with network delay
    console.log("[VoltGuard] Form submission data:", formData)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const confirmation = `VG-${Date.now().toString().slice(-8)}`
    setConfirmationNumber(confirmation)
    
    trackEvent(EVENTS.FORM_SUBMIT_SUCCESS, { 
      formData,
      confirmationNumber: confirmation 
    })
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card className="bg-slate-800 border-slate-700 shadow-2xl" id="hero-form">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{"We're on it!"}</h3>
          <p className="text-slate-300 mb-4">
            A technician will call you within 15 minutes.
          </p>
          <div className="bg-slate-900/50 rounded-lg p-4 inline-block">
            <p className="text-sm text-slate-400 mb-1">Confirmation Number</p>
            <p className="text-lg font-mono font-bold text-orange-500">{confirmationNumber}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-2xl" id="hero-form">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-white text-center">
          Get Help Now
        </CardTitle>
        <p className="text-sm text-slate-400 text-center">
          Average response time: 42 minutes
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ZIP Code Field */}
          <div className="space-y-1">
            <label htmlFor="zipCode" className="text-sm font-medium text-slate-300">
              ZIP Code
            </label>
            <div className="relative">
              <Input
                id="zipCode"
                type="text"
                inputMode="numeric"
                placeholder="60004"
                value={formData.zipCode}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                onFocus={() => handleFocus("zipCode")}
                onBlur={() => handleBlur("zipCode")}
                className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 pr-10 ${
                  errors.zipCode ? "border-red-500 focus:ring-red-500" : ""
                } ${success.zipCode ? "border-green-500 focus:ring-green-500" : ""}`}
              />
              {success.zipCode && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {errors.zipCode && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            {success.zipCode && (
              <p className="text-sm text-green-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Great! We service your area
              </p>
            )}
            {errors.zipCode && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.zipCode}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-sm font-medium text-slate-300">
              Phone Number
            </label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 555-5555"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onFocus={() => handleFocus("phone")}
                onBlur={() => handleBlur("phone")}
                className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 pr-10 ${
                  errors.phone ? "border-red-500 focus:ring-red-500" : ""
                } ${success.phone ? "border-green-500 focus:ring-green-500" : ""}`}
              />
              {success.phone && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            {errors.phone && touched.phone && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Issue Description Field */}
          <div className="space-y-1">
            <label htmlFor="issueDescription" className="text-sm font-medium text-slate-300">
              Describe Your Issue
            </label>
            <Textarea
              id="issueDescription"
              placeholder="Briefly describe your issue (e.g., 'outlets sparking in kitchen')"
              value={formData.issueDescription}
              onChange={(e) => handleChange("issueDescription", e.target.value)}
              onFocus={() => handleFocus("issueDescription")}
              onBlur={() => handleBlur("issueDescription")}
              rows={3}
              className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 resize-none ${
                errors.issueDescription ? "border-red-500 focus:ring-red-500" : ""
              } ${success.issueDescription ? "border-green-500 focus:ring-green-500" : ""}`}
            />
            <div className="flex justify-between items-center">
              <div>
                {errors.issueDescription && touched.issueDescription && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.issueDescription}
                  </p>
                )}
              </div>
              <span className={`text-xs ${
                formData.issueDescription.length > 450 
                  ? "text-orange-400" 
                  : "text-slate-500"
              }`}>
                {formData.issueDescription.length}/500
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Securing Your Slot...
              </>
            ) : (
              "Secure Your Appointment Slot"
            )}
          </Button>

          {/* Trust Indicator */}
          <p className="text-xs text-slate-500 text-center">
            No credit card required. We&apos;ll call to confirm.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
