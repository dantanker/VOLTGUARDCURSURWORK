"use client"

import Image from "next/image"
import { Zap } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ImageComparisonProps {
  beforeImage: string
  afterImage: string
  altBefore?: string
  altAfter?: string
  className?: string
}

export function ImageComparison({
  beforeImage,
  afterImage,
  altBefore = "Before",
  altAfter = "After",
  className,
}: ImageComparisonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const afterClipRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(50)
  const draggingRef = useRef(false)

  const applyPosition = useCallback((pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct))
    positionRef.current = clamped
    if (afterClipRef.current) {
      afterClipRef.current.style.clipPath = `inset(0 0 0 ${clamped}%)`
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${clamped}%`
    }
  }, [])

  const updateFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0) return
      applyPosition(((clientX - rect.left) / rect.width) * 100)
    },
    [applyPosition]
  )

  const stopDrag = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setIsDragging(false)
    const el = containerRef.current
    if (el) el.style.touchAction = ""
  }, [])

  const startDrag = useCallback(
    (clientX: number, pointerId?: number) => {
      draggingRef.current = true
      setIsDragging(true)
      const el = containerRef.current
      if (el) {
        el.style.touchAction = "none"
        if (pointerId !== undefined) {
          try {
            el.setPointerCapture(pointerId)
          } catch {
            // ignore
          }
        }
      }
      updateFromClientX(clientX)
    },
    [updateFromClientX]
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      e.preventDefault()
      updateFromClientX(e.clientX)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingRef.current) return
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        // ignore
      }
      stopDrag()
    }

    el.addEventListener("pointermove", onPointerMove, { passive: false })
    el.addEventListener("pointerup", onPointerUp)
    el.addEventListener("pointercancel", onPointerUp)

    return () => {
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", onPointerUp)
      el.removeEventListener("pointercancel", onPointerUp)
    }
  }, [stopDrag, updateFromClientX])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full select-none overflow-hidden rounded-xl bg-slate-950 shadow-lg shadow-black/30 aspect-[3/2]",
        className
      )}
      onPointerLeave={() => {
        if (draggingRef.current) stopDrag()
      }}
    >
      <Image
        src={beforeImage}
        alt={altBefore}
        fill
        draggable={false}
        className="object-cover object-left pointer-events-none"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={false}
      />

      <div
        ref={afterClipRef}
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: "inset(0 0 0 50%)" }}
      >
        <Image
          src={afterImage}
          alt={altAfter}
          fill
          draggable={false}
          className="object-cover object-left pointer-events-none"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300 ring-1 ring-slate-700/80 backdrop-blur-sm md:py-0.5 md:text-[10px]">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-orange-500/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm md:py-0.5 md:text-[10px]">
        After
      </span>

      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 z-30 flex w-10 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center"
        style={{ left: "50%", touchAction: "none" }}
        onPointerDown={(e) => {
          e.preventDefault()
          startDrag(e.clientX, e.pointerId)
        }}
        role="slider"
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        tabIndex={0}
      >
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-white/90" />
        <div
          className={cn(
            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-150",
            isDragging && "scale-110 shadow-xl ring-2 ring-orange-500/30"
          )}
        >
          <Zap
            className="h-4 w-4 text-orange-500 fill-orange-500"
            strokeWidth={2.25}
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}
