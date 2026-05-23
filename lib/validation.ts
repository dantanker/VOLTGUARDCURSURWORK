import { z } from "zod"
import { SERVICE_AREA_ZIPS } from "./constants"

export const leadFormSchema = z.object({
  zipCode: z
    .string()
    .length(5, "ZIP code must be 5 digits")
    .regex(/^\d{5}$/, "Invalid ZIP code format"),
  
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Please enter a valid phone number"),
  
  issueDescription: z
    .string()
    .min(10, "Please provide more detail about your issue")
    .max(500, "Description is too long (max 500 characters)"),
})

export type LeadFormData = z.infer<typeof leadFormSchema>

export function isServiceAreaZip(zip: string): boolean {
  return SERVICE_AREA_ZIPS.includes(zip)
}

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  
  if (digits.length === 0) return ""
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export function validateZipCode(zip: string): { valid: boolean; error?: string; inServiceArea?: boolean } {
  if (zip.length === 0) {
    return { valid: false }
  }
  
  if (!/^\d+$/.test(zip)) {
    return { valid: false, error: "ZIP code must contain only numbers" }
  }
  
  if (zip.length < 5) {
    return { valid: false }
  }
  
  if (zip.length === 5) {
    const inServiceArea = isServiceAreaZip(zip)
    if (!inServiceArea) {
      return { valid: false, error: "We don't currently service this area", inServiceArea: false }
    }
    return { valid: true, inServiceArea: true }
  }
  
  return { valid: false, error: "ZIP code must be 5 digits" }
}

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  const digits = phone.replace(/\D/g, "")
  
  if (digits.length === 0) {
    return { valid: false }
  }
  
  if (digits.length < 10) {
    return { valid: false }
  }
  
  if (digits.length === 10) {
    return { valid: true }
  }
  
  return { valid: false, error: "Please enter a valid 10-digit phone number" }
}

export function validateDescription(description: string): { valid: boolean; error?: string } {
  if (description.length === 0) {
    return { valid: false }
  }
  
  if (description.length < 10) {
    return { valid: false, error: "Please provide more detail (at least 10 characters)" }
  }
  
  if (description.length > 500) {
    return { valid: false, error: "Description is too long (max 500 characters)" }
  }
  
  return { valid: true }
}
