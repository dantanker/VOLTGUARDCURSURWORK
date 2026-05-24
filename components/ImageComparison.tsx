"use client"

import Image from "next/image"
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
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      let newPosition = ((clientX - rect.left) / rect.width) * 100
      newPosition = Math.max(0, Math.min(100, newPosition))
      setSliderPosition(newPosition)
    },
    [isDragging]
  )

  const handleMouseUp = useCallback(() => setIsDragging(false), [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX)
  const handleTouchStart = () => setIsDragging(true)
  const handleTouchEnd = () => setIsDragging(false)
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX)

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchend", handleMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchend", handleMouseUp)
    }
  }, [handleMouseUp])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full select-none overflow-hidden rounded-xl bg-slate-950 shadow-lg shadow-black/30 aspect-[3/2]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
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

      <span className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300 ring-1 ring-slate-700/80 backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-orange-500/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
        After
      </span>

      <div
        className="absolute top-0 bottom-0 z-30 flex w-1 cursor-ew-resize items-center justify-center bg-white/90"
        style={{ left: `calc(${sliderPosition}% - 0.125rem)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200",
            isDragging && "scale-110 shadow-xl"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-700"
            aria-hidden
          >
            <line x1="15" y1="18" x2="9" y2="12" />
            <line x1="9" y1="6" x2="15" y2="12" />
          </svg>
        </div>
      </div>
    </div>
  )
}
