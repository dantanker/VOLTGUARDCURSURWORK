"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Minus, Plus } from "lucide-react"
import {
  SERVICE_AREA_CENTER,
  SERVICE_ZONE_RADIUS_METERS,
} from "@/lib/service-area-locations"
import { cn } from "@/lib/utils"

const SHIELD_CLIP_ID = "voltguard-shield-clip"
const MAP_SHIELD_PATH =
  "M150 12 L278 48 L278 188 Q278 278 150 338 Q22 278 22 188 L22 48 Z"
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
const LEAFLET_STYLE_ID = "voltguard-leaflet-css"

type MapVariant = "shield" | "simple"

function ShieldLeafletMap({
  variant,
  interactive,
}: {
  variant: MapVariant
  interactive: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [leafletReady, setLeafletReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.L)
  )
  const [mapUnlocked, setMapUnlocked] = useState(interactive)

  useEffect(() => {
    if (document.getElementById(LEAFLET_STYLE_ID)) return

    const link = document.createElement("link")
    link.id = LEAFLET_STYLE_ID
    link.rel = "stylesheet"
    link.href = LEAFLET_CSS
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    if (!leafletReady || !containerRef.current || !window.L || mapRef.current) {
      return
    }

    const L = window.L
    const center: [number, number] = [
      SERVICE_AREA_CENTER.lat,
      SERVICE_AREA_CENTER.lng,
    ]
    const isSimple = variant === "simple"

    const map = L.map(containerRef.current, {
      center,
      zoom: isSimple ? 10 : 9,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: interactive || mapUnlocked,
      tap: interactive || mapUnlocked,
      attributionControl: false,
    })

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map)

    const zone = L.circle(center, {
      radius: SERVICE_ZONE_RADIUS_METERS,
      color: "#ea580c",
      fillColor: "#f97316",
      fillOpacity: 0.16,
      weight: 2,
      opacity: 0.55,
    }).addTo(map)

    const markerIcon = L.divIcon({
      className: "voltguard-map-marker",
      html: `<div class="voltguard-map-marker__dot"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })

    L.marker(center, { icon: markerIcon }).addTo(map)

    map.fitBounds(zone.getBounds(), {
      padding: isSimple ? [20, 20] : [28, 28],
    })

    mapRef.current = map

    const resize = () => {
      map.invalidateSize()
      map.fitBounds(zone.getBounds(), {
        padding: isSimple ? [20, 20] : [28, 28],
      })
    }
    const t1 = window.setTimeout(resize, 100)
    const t2 = window.setTimeout(resize, 400)
    window.addEventListener("resize", resize)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener("resize", resize)
      map.remove()
      mapRef.current = null
    }
  }, [leafletReady, variant, interactive])

  useEffect(() => {
    const map = mapRef.current as (L.Map & { dragging?: { enable: () => void; disable: () => void } }) | null
    if (!map?.dragging) return
    if (mapUnlocked) {
      map.dragging.enable()
    } else {
      map.dragging.disable()
    }
  }, [mapUnlocked])

  const zoomIn = () => mapRef.current?.zoomIn()
  const zoomOut = () => mapRef.current?.zoomOut()

  const showTapOverlay = variant === "simple" && !mapUnlocked

  return (
    <>
      {!leafletReady && (
        <Script
          id="voltguard-leaflet-js"
          src={LEAFLET_JS}
          strategy="afterInteractive"
          onReady={() => setLeafletReady(true)}
        />
      )}
      <div
        ref={containerRef}
        className="voltguard-shield-map absolute inset-0 h-full w-full"
        aria-label="Service area map"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[400] bg-orange-600/[0.07] mix-blend-soft-light"
        aria-hidden
      />

      {showTapOverlay && (
        <button
          type="button"
          onClick={() => setMapUnlocked(true)}
          className="absolute inset-0 z-[450] flex items-end justify-center bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pb-4"
        >
          <span className="rounded-full border border-white/20 bg-slate-950/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            Tap to explore map
          </span>
        </button>
      )}

      <div
        className={cn(
          "absolute z-[500] flex flex-col gap-1.5",
          variant === "simple"
            ? "right-3 bottom-3"
            : "left-[3.75rem] top-[6.5rem]"
        )}
      >
        <button
          type="button"
          onClick={zoomIn}
          aria-label="Zoom in"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600/80 bg-slate-900/90 p-0 text-slate-200 shadow-md backdrop-blur-sm transition-colors hover:bg-slate-800 hover:text-white md:h-8 md:w-8"
        >
          <Plus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label="Zoom out"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600/80 bg-slate-900/90 p-0 text-slate-200 shadow-md backdrop-blur-sm transition-colors hover:bg-slate-800 hover:text-white md:h-8 md:w-8"
        >
          <Minus className="h-4 w-4 shrink-0" strokeWidth={2.5} />
        </button>
      </div>
    </>
  )
}

function SimpleMap() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-[0_12px_36px_rgba(0,0,0,0.45)]">
      <div className="relative aspect-[4/3] w-full">
        <ShieldLeafletMap variant="simple" interactive={false} />
      </div>
    </div>
  )
}

function ShieldMapFrame() {
  return (
    <div className="relative mx-auto w-full max-w-[580px] lg:max-w-[640px]">
      <div
        className="pointer-events-none absolute -inset-5 rounded-[2.5rem] opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(30,58,138,0.35), transparent 60%), radial-gradient(ellipse at 50% 85%, rgba(15,23,42,0.9), transparent 65%)",
        }}
        aria-hidden
      />

      <svg
        className="pointer-events-none absolute inset-0 z-20 h-full w-full drop-shadow-[0_8px_32px_rgba(0,0,0,0.65)]"
        viewBox="0 0 300 360"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient
            id="shieldBorderGradient"
            gradientUnits="userSpaceOnUse"
            x1="150"
            y1="12"
            x2="150"
            y2="338"
          >
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#f97316" />
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 150 175"
              to="360 150 175"
              dur="8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        <path
          d={MAP_SHIELD_PATH}
          stroke="url(#shieldBorderGradient)"
          strokeWidth="7"
          strokeLinejoin="round"
          opacity="0.35"
        />
        <path
          d={MAP_SHIELD_PATH}
          stroke="url(#shieldBorderGradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>

      <div
        className="relative aspect-[5/6] w-full overflow-hidden bg-[#1e293b] shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        style={{ clipPath: `url(#${SHIELD_CLIP_ID})` }}
      >
        <ShieldLeafletMap variant="shield" interactive />
      </div>
    </div>
  )
}

export function ShieldMap({
  variant = "shield",
}: {
  variant?: MapVariant
}) {
  if (variant === "simple") {
    return <SimpleMap />
  }

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={SHIELD_CLIP_ID} clipPathUnits="objectBoundingBox">
            <path d="M 0.5 0.033 L 0.927 0.133 L 0.927 0.522 Q 0.927 0.772 0.5 0.939 Q 0.073 0.772 0.073 0.522 L 0.073 0.133 Z" />
          </clipPath>
        </defs>
      </svg>
      <ShieldMapFrame />
    </>
  )
}
