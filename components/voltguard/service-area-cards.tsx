"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  MapPin,
  Phone,
  Receipt,
  Search,
  Shield,
  XCircle,
} from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import {
  BUSINESS_HOURS,
  DIAGNOSTIC_FEE,
  PHONE_LINK,
  PHONE_NUMBER,
  SERVICE_AREA_CITIES,
  SERVICE_AREA_ZIPS,
  WARRANTY_YEARS,
} from "@/lib/constants"
import { isServiceAreaZip } from "@/lib/validation"
import { cn } from "@/lib/utils"

const cityZipMap: Record<string, string[]> = {
  "Arlington Heights": ["60004", "60005"],
  Schaumburg: ["60173", "60193"],
  Palatine: ["60056"],
  "Hoffman Estates": ["60169", "60192"],
}

const jobIncludes = [
  "Illinois-licensed master electricians on every call",
  "Municipal permits pulled when your project requires them",
  "Code-compliant work with inspection support",
  `${WARRANTY_YEARS}-year written warranty on all repairs`,
]

const dispatchSteps = [
  { step: "1", text: "Call or request a quote — we triage by urgency" },
  { step: "2", text: "Technician dispatched with a clear arrival window" },
  { step: "3", text: "On-site diagnosis and upfront price before work begins" },
  { step: "4", text: "Repair completed, tested, and documented for your records" },
]

const CARD_LABELS = [
  "Coverage Zone",
  "Availability",
  "Every Job Includes",
  "Upfront Pricing",
  "Contact Us",
]

function CardShell({
  icon: Icon,
  title,
  children,
  accent = "orange",
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
  accent?: "orange" | "blue"
}) {
  return (
    <div className="relative h-full min-h-[340px] overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{
          background:
            accent === "orange"
              ? "radial-gradient(circle, rgba(249,115,22,0.8), transparent 70%)"
              : "radial-gradient(circle, rgba(59,130,246,0.8), transparent 70%)",
        }}
        aria-hidden
      />
      <h3 className="relative flex items-center gap-2 text-lg font-semibold text-white mb-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 ring-1 ring-orange-500/25">
          <Icon className="h-4 w-4 text-orange-400" />
        </span>
        {title}
      </h3>
      <div className="relative">{children}</div>
    </div>
  )
}

function CoverageZoneSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState("")

  const result = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) return null

    const normalized = trimmed.toLowerCase()
    const digitsOnly = trimmed.replace(/\D/g, "")

    if (digitsOnly.length >= 5) {
      const zip = digitsOnly.slice(0, 5)
      if (isServiceAreaZip(zip)) {
        const city = Object.entries(cityZipMap).find(([, zips]) =>
          zips.includes(zip)
        )?.[0]
        return {
          status: "covered" as const,
          message: `ZIP ${zip} is in our primary service zone${city ? ` (${city})` : ""}.`,
        }
      }
      if (digitsOnly.length === 5) {
        return {
          status: "unknown" as const,
          message: `ZIP ${zip} is outside our primary zone — call us and we'll confirm availability.`,
        }
      }
    }

    const matchedCity = SERVICE_AREA_CITIES.find(
      (city) =>
        city.toLowerCase().includes(normalized) ||
        normalized.includes(city.toLowerCase())
    )

    if (matchedCity) {
      const zips = cityZipMap[matchedCity]?.join(", ") ?? ""
      return {
        status: "covered" as const,
        message: `${matchedCity} is covered${zips ? ` (ZIPs: ${zips})` : ""}.`,
      }
    }

    return {
      status: "unknown" as const,
      message: `We couldn't find "${trimmed}" — try a city name or 5-digit ZIP, or call to confirm.`,
    }
  }, [query])

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city or ZIP code..."
          className="h-11 border-slate-600/80 bg-slate-900/60 pl-10 text-base text-white placeholder:text-slate-500 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20 md:text-sm"
        />
      </div>

      {result ? (
        <div
          className={cn(
            "flex gap-3 rounded-xl border px-4 py-3 text-sm",
            result.status === "covered"
              ? "border-green-500/30 bg-green-500/10 text-green-100"
              : "border-amber-500/30 bg-amber-500/10 text-amber-100"
          )}
        >
          {result.status === "covered" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          )}
          <p className="leading-relaxed">{result.message}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-500 md:text-xs">
          Enter your city or ZIP to check if VoltGuard serves your area.
        </p>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          Cities we serve
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {SERVICE_AREA_CITIES.map((city) => (
            <li
              key={city}
              className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2.5 text-sm text-slate-300 md:py-2 md:text-xs"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              {city}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** One simple card for mobile — no swipe carousel. */
export function ServiceAreaMobileCard() {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 shadow-[0_8px_28px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 ring-1 ring-orange-500/25">
          <MapPin className="h-5 w-5 text-orange-400" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-white">Coverage & hours</h3>
          <p className="mt-0.5 text-sm text-slate-400">
            Northwest suburbs · 24/7 emergencies
          </p>
        </div>
      </div>

      <CoverageZoneSearch compact />

      <div className="mt-4 space-y-3 border-t border-slate-700/60 pt-4">
        <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-orange-100">{BUSINESS_HOURS}</p>
          <p className="mt-1 text-xs text-orange-200/70">
            Mon–Sat 7 AM – 9 PM for scheduled work
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
          <Shield className="h-4 w-4 shrink-0 text-blue-300" />
          <span>Illinois licensed · Bonded &amp; insured</span>
        </div>

        <a
          href={PHONE_LINK}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/15 px-5 py-3 text-base font-semibold text-orange-100"
        >
          <Phone className="h-4 w-4" />
          Call {PHONE_NUMBER}
        </a>
      </div>
    </div>
  )
}

export function ServiceAreaCards() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Swipe to explore
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={current === 0}
            className="flex h-11 w-11 md:h-8 md:w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-slate-300 transition-colors hover:border-orange-500/40 hover:text-white disabled:opacity-30"
            aria-label="Previous card"
          >
            <ChevronLeft className="h-5 w-5 md:h-4 md:w-4" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={current === CARD_LABELS.length - 1}
            className="flex h-11 w-11 md:h-8 md:w-8 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-slate-300 transition-colors hover:border-orange-500/40 hover:text-white disabled:opacity-30"
            aria-label="Next card"
          >
            <ChevronRight className="h-5 w-5 md:h-4 md:w-4" />
          </button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false, dragFree: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          <CarouselItem className="pl-3 basis-full">
            <CardShell icon={MapPin} title="Coverage Zone">
              <CoverageZoneSearch />
            </CardShell>
          </CarouselItem>

          <CarouselItem className="pl-3 basis-full">
            <CardShell icon={CalendarClock} title="Availability">
              <div className="space-y-3 text-sm">
                <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3">
                  <p className="font-semibold text-orange-200">{BUSINESS_HOURS}</p>
                  <p className="text-xs text-orange-200/70 mt-1">
                    Emergency calls answered immediately — average 42-minute dispatch
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3 text-slate-300">
                  <p className="font-medium text-white">Scheduled appointments</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Mon–Sat, 7 AM – 9 PM · Same-day slots when you book before 2 PM
                  </p>
                </div>
              </div>
            </CardShell>
          </CarouselItem>

          <CarouselItem className="pl-3 basis-full">
            <CardShell icon={BadgeCheck} title="Every Job Includes">
              <ul className="space-y-3">
                {jobIncludes.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-slate-300">
                    <FileCheck className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardShell>
          </CarouselItem>

          <CarouselItem className="pl-3 basis-full">
            <CardShell icon={Receipt} title="Upfront Pricing">
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Flat-rate quotes before any work starts — no overtime charges, no hidden
                fees. ${DIAGNOSTIC_FEE} diagnostic fee{" "}
                <span className="text-white font-medium">
                  waived when you proceed with the repair
                </span>
                .
              </p>
              <div className="rounded-xl border border-slate-700/60 bg-slate-900/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                  How a service call works
                </p>
                <ol className="space-y-2">
                  {dispatchSteps.map((item) => (
                    <li key={item.step} className="flex gap-3 text-xs text-slate-400">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-300">
                        {item.step}
                      </span>
                      <span className="leading-relaxed pt-0.5">{item.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </CardShell>
          </CarouselItem>

          <CarouselItem className="pl-3 basis-full">
            <CardShell icon={Phone} title="Contact Us">
              <div className="flex flex-col justify-center gap-4 py-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Not sure if we cover your address? Our dispatch team can confirm
                  coverage and get a technician headed your way.
                </p>
                <a
                  href={PHONE_LINK}
                  className="flex items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/15 px-5 py-4 text-sm font-semibold text-orange-100 transition-colors hover:bg-orange-500/25 hover:border-orange-400/60"
                >
                  <Phone className="h-4 w-4" />
                  Call {PHONE_NUMBER}
                </a>
                <p className="text-center text-xs text-slate-500">
                  Primary ZIPs: {SERVICE_AREA_ZIPS.join(" · ")}
                </p>
              </div>
            </CardShell>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className="mt-5 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {CARD_LABELS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to ${label}`}
              className={cn(
                "min-h-11 min-w-11 md:min-h-0 md:min-w-0 flex items-center justify-center rounded-full transition-all duration-300",
                current === index
                  ? "md:h-2 md:w-6 md:min-w-6 bg-orange-500"
                  : "md:h-2 md:w-2 bg-slate-600 hover:bg-slate-500"
              )}
            >
              <span
                className={cn(
                  "rounded-full transition-all duration-300 md:hidden",
                  current === index ? "h-2.5 w-6 bg-orange-500" : "h-2.5 w-2.5 bg-slate-600"
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">{CARD_LABELS[current]}</p>
      </div>
    </div>
  )
}
