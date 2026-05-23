# VoltGuard Electrical - Implementation Kickstart

## Project Overview

**Goal:** Build a high-converting, mobile-first landing page for VoltGuard Electrical targeting suburban Chicago homeowners experiencing electrical emergencies.

**Primary Persona:** "Emergency Emily" - A 35-45 year old homeowner in a panic state, needing immediate electrical help. She's anxious about safety, legitimacy, and pricing transparency.

**Single CTA Funnel:** Every interaction funnels to the Hero lead-capture form.

---

## Design System

### Color Palette (Tailwind Native)
| Role | Tailwind Class | Hex Equivalent |
|------|----------------|----------------|
| Primary Background | `slate-900` | #0f172a |
| Trust Blue | `blue-600` | #2563eb |
| Safety Amber CTA | `orange-500` | #f97316 |
| Success Green | `green-500` | #22c55e |
| Light Background | `slate-50` | #f8fafc |
| Muted Text | `slate-400` | #94a3b8 |

### Typography
- **Headings:** Geist Sans (system default, already configured)
- **Body:** Geist Sans
- **Font sizes:** Mobile-first scaling with `text-balance` for headlines

### Spacing Scale
- Section padding: `py-16 md:py-24`
- Container max-width: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- Card gaps: `gap-6` or `gap-8`

---

## File Architecture

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx          # Update metadata for SEO
│   ├── page.tsx             # Server component orchestrator
│   └── globals.css          # Add VoltGuard custom CSS variables
├── components/
│   └── voltguard/
│       ├── header.tsx              # Sticky nav with CTA button
│       ├── hero-section.tsx        # Hero + Lead form wrapper
│       ├── lead-capture-form.tsx   # Stateful form with validation
│       ├── features-matrix.tsx     # 3-card trust features
│       ├── pricing-section.tsx     # Flat-rate pricing transparency
│       ├── social-proof.tsx        # Stats + testimonials
│       ├── guarantee-section.tsx   # Risk reversal guarantees
│       ├── services-grid.tsx       # Service cards with scroll links
│       ├── faq-section.tsx         # Accordion FAQs
│       ├── footer.tsx              # Phone CTA + availability
│       └── availability-counter.tsx # Pseudo-dynamic counter
├── lib/
│   ├── analytics.ts         # Mock analytics event tracker
│   ├── validation.ts        # Zod schemas for form validation
│   └── constants.ts         # Service area ZIPs, phone number, etc.
```

---

## Component Specifications

### 1. Header (`header.tsx`)
**Type:** Client Component (scroll state)
**Behavior:**
- Sticky positioning with `position: sticky; top: 0`
- Logo on left, "Book Emergency Service" CTA button on right
- CTA smooth-scrolls to `#hero-form` section
- Mobile: Hamburger menu with full-screen overlay OR simplified header with just logo + CTA
- Background blur on scroll: `bg-slate-900/95 backdrop-blur-sm`

### 2. Hero Section (`hero-section.tsx`)
**Type:** Client Component wrapper
**Layout:**
- Desktop: 2-column grid (60% content / 40% form)
- Mobile: Single column, headline at absolute top with minimal padding
- Form card must "peak" 15-20% above fold on mobile

**Content (Left Column):**
```
Badge: "24/7 Emergency Response"
H1: "Chicago's Most Trusted Emergency Electricians"
Subhead: "Fast, transparent, licensed. We'll have power restored before you finish your coffee."
Trust badges row: Licensed & Insured | Background-Checked | Flat-Rate Pricing
```

### 3. Lead Capture Form (`lead-capture-form.tsx`)
**Type:** Client Component (stateful)
**Fields:**
1. **ZIP Code** (required)
   - 5-digit format validation
   - Service area check: 60004, 60005, 60056, 60173, 60193
   - Success state: Green checkmark + "Great! We service your area"
   - Error state: Red border + "We don't currently service this area"

2. **Phone Number** (required)
   - Auto-format mask: (XXX) XXX-XXXX
   - Real-time formatting as user types
   - Validation: 10 digits required

3. **Issue Description** (required)
   - Textarea with placeholder: "Briefly describe your issue (e.g., 'outlets sparking in kitchen')"
   - 500 character max with live counter: "0/500"
   - Min 10 characters for meaningful description

**Submit Button:**
- Text: "Secure Your Appointment Slot"
- Color: `bg-orange-500 hover:bg-orange-600`
- Full width on mobile
- Loading state with spinner

**Success State:**
- Form card transforms in-place (no redirect)
- Checkmark animation
- "We're on it!" heading
- "A technician will call you within 15 minutes" subtext
- Confirmation number (mock: "VG-" + timestamp)

**Analytics Events:**
- `form_field_focus` - When user focuses each field
- `form_field_complete` - When user completes each field
- `form_validation_error` - When validation fails
- `form_submit_attempt` - When submit is clicked
- `form_submit_success` - On successful mock submission

### 4. Features Matrix (`features-matrix.tsx`)
**Type:** Static/Server Component
**Layout:** 3-column grid on desktop, single column on mobile
**Cards:**
1. **Response Time**
   - Icon: Clock
   - Heading: "42-Minute Average Response"
   - Text: "We know every minute counts. Our dispatchers prioritize by urgency."

2. **Licensed & Insured**
   - Icon: Shield
   - Heading: "Fully Licensed & Insured"
   - Text: "All technicians are background-checked and carry full liability coverage."

3. **Flat-Rate Pricing**
   - Icon: DollarSign
   - Heading: "No Surprise Bills"
   - Text: "You'll know the exact cost before we start. Diagnostic fee: $89."

### 5. Pricing Section (`pricing-section.tsx`)
**Type:** Static Component
**Content:**
- Heading: "Transparent, Flat-Rate Pricing"
- Subhead: "No hidden fees. No overtime charges. Just honest work."
- Diagnostic fee callout: "$89 Diagnostic Fee (waived with repair)"
- Service price list:
  - Outlet Repair: $125-175
  - Breaker Replacement: $150-250
  - Panel Upgrade: $1,800-2,500
  - Emergency Generator Install: Quote Required
  - Whole-Home Surge Protection: $350-500

### 6. Social Proof (`social-proof.tsx`)
**Type:** Static Component
**Stat Callout:**
- "2,847 Chicago families served this year"
- "4.9/5 average rating"

**Testimonials (3 cards):**
1. "They came in 30 minutes and fixed our panel. Professional and kind." — Sarah M., Arlington Heights
2. "Finally, an electrician who explained everything in plain English." — Mark D., Schaumburg
3. "Worth every penny. They found a dangerous wiring issue others missed." — Lisa K., Palatine

### 7. Guarantee Section (`guarantee-section.tsx`)
**Type:** Static Component
**Layout:** 3-column grid
**Guarantees:**
1. **Same-Day Service** - "Book by 2 PM, we'll be there today."
2. **1-Year Warranty** - "All repairs backed by our written guarantee."
3. **Price Match** - "Found a lower quote? We'll beat it by 10%."

### 8. Services Grid (`services-grid.tsx`)
**Type:** Client Component (scroll behavior)
**Services (6 cards):**
1. Panel Upgrades
2. Outlet & Switch Repair
3. Breaker Issues
4. Lighting Installation
5. Surge Protection
6. Emergency Troubleshooting

**Card Behavior:**
- "Book this service →" link smooth-scrolls to `#hero-form`
- Track click events for analytics

### 9. FAQ Section (`faq-section.tsx`)
**Type:** Client Component (accordion state)
**Behavior:**
- First 2 items pre-expanded
- Single item open at a time
- Uses shadcn Accordion component

**Questions:**
1. "How quickly can you arrive?" (pre-expanded)
2. "What are your prices?" (pre-expanded)
3. "Are your electricians licensed?"
4. "Do you offer warranties?"
5. "What areas do you serve?"
6. "Can I get an estimate before you start?"

### 10. Footer (`footer.tsx`)
**Type:** Client Component
**Content:**
- Large phone CTA button: `tel:(555) 019-2834`
- Button must be 48px+ height on mobile for tap target
- Pseudo-dynamic availability counter
- "Live Dispatch Status: X minutes average response"
- Business info, hours, service areas

### 11. Availability Counter (`availability-counter.tsx`)
**Type:** Client Component
**Behavior:**
- Displays "X Technicians Available Now"
- Pseudo-dynamic: fluctuates 2-5 based on hour of day
- Updates every 30 seconds for "live" feel
- Green pulse dot animation

---

## Validation Schema (`lib/validation.ts`)

```typescript
import { z } from "zod"

const VALID_ZIPS = ["60004", "60005", "60056", "60173", "60193"]

export const leadFormSchema = z.object({
  zipCode: z
    .string()
    .length(5, "ZIP code must be 5 digits")
    .regex(/^\d{5}$/, "Invalid ZIP code format")
    .refine((zip) => VALID_ZIPS.includes(zip), "We don't service this area yet"),
  
  phone: z
    .string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone must be (XXX) XXX-XXXX format"),
  
  issueDescription: z
    .string()
    .min(10, "Please provide more detail about your issue")
    .max(500, "Description too long"),
})
```

---

## Analytics Wrapper (`lib/analytics.ts`)

```typescript
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
    "background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px;",
    event,
    properties || ""
  )
  
  // In production, this would send to GA4/Segment/etc.
  return analyticsEvent
}

// Pre-defined events
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
}
```

---

## Constants (`lib/constants.ts`)

```typescript
export const PHONE_NUMBER = "(555) 019-2834"
export const PHONE_LINK = "tel:+15550192834"

export const SERVICE_AREA_ZIPS = ["60004", "60005", "60056", "60173", "60193"]

export const SERVICE_AREA_CITIES = [
  "Arlington Heights",
  "Schaumburg",
  "Palatine",
  "Hoffman Estates",
]

export const DIAGNOSTIC_FEE = 89
export const WARRANTY_YEARS = 1

export const BUSINESS_HOURS = "24/7 Emergency Service Available"
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Adjustments |
|------------|-------|-------------------|
| Mobile | < 640px | Single column, tight padding, form peaks above fold |
| Tablet | 640-1024px | 2-column where appropriate, medium padding |
| Desktop | > 1024px | Full 2-column hero, max-width container |

---

## Implementation Order

### Phase 1: Foundation
1. Update `globals.css` with VoltGuard color tokens
2. Update `layout.tsx` with SEO metadata
3. Create `lib/constants.ts`
4. Create `lib/analytics.ts`
5. Create `lib/validation.ts`

### Phase 2: Core Components
6. Create `header.tsx`
7. Create `lead-capture-form.tsx` (most complex)
8. Create `hero-section.tsx`

### Phase 3: Content Sections
9. Create `features-matrix.tsx`
10. Create `pricing-section.tsx`
11. Create `social-proof.tsx`
12. Create `guarantee-section.tsx`
13. Create `services-grid.tsx`
14. Create `faq-section.tsx`

### Phase 4: Footer & Polish
15. Create `availability-counter.tsx`
16. Create `footer.tsx`
17. Assemble all in `page.tsx`

### Phase 5: Mobile Optimization
18. Test and refine mobile hero form visibility
19. Verify tap targets on footer phone button
20. Test smooth scroll behavior on all CTAs

---

## Success Criteria

- [ ] Form validates in real-time with inline errors
- [ ] ZIP code shows service area confirmation/rejection
- [ ] Phone auto-formats to (XXX) XXX-XXXX
- [ ] Character counter works on textarea
- [ ] Form success state displays without redirect
- [ ] All CTAs smooth-scroll to hero form
- [ ] Analytics events log to console
- [ ] Availability counter fluctuates based on time
- [ ] First 2 FAQ items are pre-expanded
- [ ] Only 1 FAQ item can be open at a time
- [ ] Footer phone button is 48px+ on mobile
- [ ] Hero form "peaks" above fold on mobile
- [ ] All content is fully responsive

---

## Notes

- **No external API calls** - All data is mocked/static
- **No database** - Frontend prototype only
- **Console logging** - Analytics wrapper prints styled events to dev console
- **Marketing copy is editable** - All text strings are in constants or clearly labeled
- **Chicago-focused** - All testimonials, service areas reference suburban Chicago
