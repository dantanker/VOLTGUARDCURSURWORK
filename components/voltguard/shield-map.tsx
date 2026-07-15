"use client"

import { useEffect, useRef, useState } from "react"
import { Minus, Plus } from "lucide-react"
import type { Map as LeafletMap } from "leaflet"
import {
  SERVICE_AREA_CENTER,
  SERVICE_ZONE_RADIUS_METERS,
} from "@/lib/service-area-locations"
import { cn } from "@/lib/utils"

import "leaflet/dist/leaflet.css"

const SHIELD_CLIP_ID = "voltguard-shield-clip"
const MAP_SHIELD_PATH =
  "M150 12 L278 48 L278 188 Q278 278 150 338 Q22 278 22 188 L22 48 Z"

const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
const TILE_FALLBACK_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

type MapVariant = "shield" | "simple"

function ShieldLeafletMap({
  variant,
  interactive,
}: {
  variant: MapVariant
  interactive: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const [mapUnlocked, setMapUnlocked] = useState(interactive)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let map: LeafletMap | null = null
    let resizeObserver: ResizeObserver | null = null
    let tileErrorCount = 0
    const timeouts: number[] = []

    const init = async () => {
      try {
        const L = (await import("leaflet")).default
        if (cancelled || !containerRef.current) return

        // Strict Mode remount can leave a stale Leaflet id
        const el = containerRef.current as HTMLDivElement & {
          _leaflet_id?: number
        }
        if (el._leaflet_id) {
          delete el._leaflet_id
          el.innerHTML = ""
        }

        const center: [number, number] = [
          SERVICE_AREA_CENTER.lat,
          SERVICE_AREA_CENTER.lng,
        ]
        const isSimple = variant === "simple"

        map = L.map(el, {
          center,
          zoom: isSimple ? 10 : 9,
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: interactive,
          attributionControl: false,
        })

        if (cancelled) {
          map?.remove()
          map = null
          return
        }

        const tiles = L.tileLayer(TILE_URL, {
          subdomains: "abcd",
          maxZoom: 19,
          crossOrigin: true,
        })

        tiles.on("tileerror", () => {
          tileErrorCount += 1
          if (tileErrorCount >= 4 && map && !cancelled) {
            map.removeLayer(tiles)
            L.tileLayer(TILE_FALLBACK_URL, {
              subdomains: "abc",
              maxZoom: 19,
            }).addTo(map)
            tileErrorCount = Number.POSITIVE_INFINITY
          }
        })

        tiles.addTo(map)

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

        const fit = () => {
          if (!map || cancelled) return
          map.invalidateSize()
          map.fitBounds(zone.getBounds(), {
            padding: isSimple ? [20, 20] : [28, 28],
          })
        }

        fit()
        for (const ms of [50, 250, 600]) {
          timeouts.push(window.setTimeout(fit, ms))
        }

        resizeObserver = new ResizeObserver(() => {
          map?.invalidateSize({ animate: false })
        })
        resizeObserver.observe(el)

        mapRef.current = map
      } catch {
        if (!cancelled) setLoadError(true)
      }
    }

    void init()

    return () => {
      cancelled = true
      for (const id of timeouts) window.clearTimeout(id)
      resizeObserver?.disconnect()
      if (map) {
        map.remove()
        map = null
      }
      mapRef.current = null
    }
  }, [variant, interactive])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
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
      <div
        ref={containerRef}
        className="voltguard-shield-map absolute inset-0 z-0 h-full w-full min-h-[200px]"
        aria-label="Service area map"
      />

      {loadError && (
        <div className="absolute inset-0 z-[420] flex items-center justify-center bg-slate-900 px-4 text-center text-sm text-slate-300">
          Map couldn&apos;t load. Please refresh the page.
        </div>
      )}

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
