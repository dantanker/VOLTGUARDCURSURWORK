"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import Image from "next/image"
import { SERVICES } from "@/lib/constants"

const DESKTOP_CARD_WIDTH = 280
const DESKTOP_GAP = 28
const SERVICE_COUNT = SERVICES.length

/** Three copies for seamless infinite scroll */
const galleryServices = [...SERVICES, ...SERVICES, ...SERVICES]

type Layout = {
  cardWidth: number
  gap: number
  stride: number
  setWidth: number
  isMobile: boolean
}

function getLayout(containerWidth: number): Layout {
  const isMobile = containerWidth < 768
  // Mobile: ~72% of viewport so side cards peek — keeps the arc look without crowding
  const cardWidth = isMobile
    ? Math.round(Math.min(260, Math.max(210, containerWidth * 0.72)))
    : DESKTOP_CARD_WIDTH
  const gap = isMobile ? 14 : DESKTOP_GAP
  const stride = cardWidth + gap
  return {
    cardWidth,
    gap,
    stride,
    setWidth: SERVICE_COUNT * stride,
    isMobile,
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt))
}

export function ServicesArcGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLElement | null)[]>([])
  const layoutRef = useRef<Layout>(getLayout(400))

  const [layout, setLayout] = useState<Layout>(() => getLayout(400))

  const currentX = useRef(0)
  const targetX = useRef(0)
  /** px / ms */
  const velocity = useRef(0)
  const layoutReady = useRef(false)

  const isPointerDown = useRef(false)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const dragStartOffset = useRef(0)
  const lastPointerX = useRef(0)
  const lastPointerTime = useRef(0)
  const lastFrameTime = useRef(0)
  const rafId = useRef(0)
  const activePointerId = useRef<number | null>(null)
  const snapPending = useRef(false)
  const isVisibleRef = useRef(true)
  const startLoopRef = useRef<() => void>(() => {})

  const normalizeScroll = useCallback(() => {
    const { setWidth } = layoutRef.current
    if (setWidth <= 0) return
    while (targetX.current >= setWidth * 2) {
      targetX.current -= setWidth
      currentX.current -= setWidth
    }
    while (targetX.current < setWidth) {
      targetX.current += setWidth
      currentX.current += setWidth
    }
  }, [])

  const snapToNearest = useCallback(() => {
    const { stride } = layoutRef.current
    if (stride <= 0) return
    targetX.current = Math.round(targetX.current / stride) * stride
    velocity.current = 0
    snapPending.current = false
  }, [])

  const updateCardTransforms = useCallback((scrollX: number) => {
    const container = containerRef.current
    if (!container) return

    const { cardWidth, stride, isMobile } = layoutRef.current
    const containerWidth = container.clientWidth
    const centerX = containerWidth / 2
    const paddingLeft = centerX - cardWidth / 2

    // Lighter transforms on phone — cheaper while scrolling the page nearby
    const rotateAmount = isMobile ? 4 : 12
    const arcAmount = isMobile ? -10 : -28
    const scaleAmount = isMobile ? 0.03 : 0.08

    cardsRef.current.forEach((card, index) => {
      if (!card) return
      const cardCenter = paddingLeft + index * stride + cardWidth / 2 - scrollX
      const offset = cardCenter - centerX
      const norm = Math.max(-1, Math.min(1, offset / Math.max(centerX, 1)))
      const eased = Math.sin((norm * Math.PI) / 2)

      card.style.transform = `translate3d(0, ${arcAmount * (1 - Math.abs(eased))}px, 0) rotate(${eased * rotateAmount}deg) scale(${1 - Math.abs(eased) * scaleAmount})`
    })
  }, [])

  const applyTrackPosition = useCallback(
    (x: number) => {
      const track = trackRef.current
      if (track) {
        track.style.transform = `translate3d(${-x}px, 0, 0)`
      }
      updateCardTransforms(x)
    },
    [updateCardTransforms]
  )

  const applyLayout = useCallback(
    (next: Layout, preservePosition: boolean) => {
      const prev = layoutRef.current
      const same =
        prev.cardWidth === next.cardWidth &&
        prev.gap === next.gap &&
        prev.isMobile === next.isMobile

      if (preservePosition && prev.stride > 0 && layoutReady.current) {
        const ratio = next.stride / prev.stride
        currentX.current *= ratio
        targetX.current *= ratio
      } else if (!layoutReady.current) {
        currentX.current = next.setWidth
        targetX.current = next.setWidth
        layoutReady.current = true
      }

      layoutRef.current = next
      if (!same) setLayout(next)
      normalizeScroll()
      applyTrackPosition(currentX.current)
    },
    [applyTrackPosition, normalizeScroll]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sync = () => applyLayout(getLayout(container.clientWidth), true)
    sync()

    const ro = new ResizeObserver(sync)
    ro.observe(container)

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (!entry.isIntersecting && rafId.current) {
          cancelAnimationFrame(rafId.current)
          rafId.current = 0
        }
      },
      { rootMargin: "80px 0px" }
    )
    io.observe(container)

    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [applyLayout])

  useEffect(() => {
    const startLoop = () => {
      if (rafId.current || !isVisibleRef.current) return
      lastFrameTime.current = performance.now()

      const tick = (now: number) => {
        if (!isVisibleRef.current && !isDragging.current) {
          rafId.current = 0
          return
        }

        const dt = Math.min(Math.max((now - lastFrameTime.current) / 1000, 0), 0.032)
        lastFrameTime.current = now
        const { isMobile } = layoutRef.current

        if (!isDragging.current) {
          const stopThreshold = isMobile ? 0.04 : 0.02
          const friction = isMobile ? 4.2 : 3.2

          if (Math.abs(velocity.current) > stopThreshold) {
            targetX.current += velocity.current * (dt * 1000)
            velocity.current *= Math.exp(-friction * dt)
            if (isMobile && Math.abs(velocity.current) <= stopThreshold * 2) {
              snapPending.current = true
            }
          } else {
            velocity.current = 0
            if (isMobile && snapPending.current) {
              snapToNearest()
            }
          }

          const follow = isMobile ? 18 : 14
          currentX.current = damp(currentX.current, targetX.current, follow, dt)
        } else {
          currentX.current = targetX.current
        }

        normalizeScroll()
        applyTrackPosition(currentX.current)

        const settled =
          !isDragging.current &&
          Math.abs(velocity.current) < (layoutRef.current.isMobile ? 0.04 : 0.02) &&
          Math.abs(currentX.current - targetX.current) < 0.4

        if (settled) {
          rafId.current = 0
          return
        }

        rafId.current = requestAnimationFrame(tick)
      }

      rafId.current = requestAnimationFrame(tick)
    }

    startLoopRef.current = startLoop
    startLoop()

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
      rafId.current = 0
    }
  }, [applyTrackPosition, normalizeScroll, snapToNearest])

  const endDrag = (e: React.PointerEvent) => {
    if (activePointerId.current !== null && e.pointerId !== activePointerId.current) {
      return
    }

    const wasDragging = isDragging.current
    isPointerDown.current = false
    isDragging.current = false
    activePointerId.current = null

    try {
      containerRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      // already released
    }

    const container = containerRef.current
    if (container) container.style.touchAction = "pan-y"

    if (!wasDragging) return

    const { isMobile, stride } = layoutRef.current
    const maxVel = isMobile ? 1.8 : 2.8
    velocity.current = Math.max(-maxVel, Math.min(maxVel, velocity.current))

    if (isMobile) {
      if (Math.abs(velocity.current) > 0.35) {
        const direction = velocity.current > 0 ? 1 : -1
        targetX.current =
          Math.round(targetX.current / stride + direction * 0.25) * stride
      }
      snapPending.current = true
      if (Math.abs(velocity.current) < 0.12) {
        snapToNearest()
      }
    }

    startLoopRef.current()
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return

    isPointerDown.current = true
    isDragging.current = false
    snapPending.current = false
    activePointerId.current = e.pointerId
    velocity.current = 0
    dragStartX.current = e.clientX
    dragStartY.current = e.clientY
    dragStartOffset.current = targetX.current
    lastPointerX.current = e.clientX
    lastPointerTime.current = performance.now()
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return
    if (activePointerId.current !== null && e.pointerId !== activePointerId.current) {
      return
    }

    const dxTotal = e.clientX - dragStartX.current
    const dyTotal = e.clientY - dragStartY.current

    if (!isDragging.current) {
      const slop = 6
      if (Math.abs(dxTotal) < slop && Math.abs(dyTotal) < slop) return

      // Prefer vertical page scroll unless clearly horizontal
      if (Math.abs(dyTotal) > Math.abs(dxTotal) * 0.85) {
        isPointerDown.current = false
        activePointerId.current = null
        return
      }

      isDragging.current = true
      const container = containerRef.current
      if (container) {
        container.style.touchAction = "none"
        container.setPointerCapture(e.pointerId)
      }
      dragStartOffset.current = targetX.current
      dragStartX.current = e.clientX
      lastPointerX.current = e.clientX
      lastPointerTime.current = performance.now()
    }

    e.preventDefault()

    const now = performance.now()
    const dtMs = Math.max(now - lastPointerTime.current, 1)
    const frameDx = e.clientX - lastPointerX.current
    const instant = -frameDx / dtMs
    velocity.current = velocity.current * 0.55 + instant * 0.45

    lastPointerX.current = e.clientX
    lastPointerTime.current = now

    targetX.current = dragStartOffset.current - (e.clientX - dragStartX.current)
    currentX.current = targetX.current
    normalizeScroll()
    applyTrackPosition(currentX.current)
    startLoopRef.current()
  }

  const onWheel = (e: React.WheelEvent) => {
    const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY)
    if (!isHorizontal && !e.shiftKey) return

    e.preventDefault()
    const delta = e.shiftKey ? e.deltaY : e.deltaX !== 0 ? e.deltaX : e.deltaY
    targetX.current += delta
    velocity.current = delta * 0.03
    snapPending.current = layoutRef.current.isMobile
    startLoopRef.current()
  }

  const { cardWidth, gap, isMobile } = layout

  return (
    <div
      ref={containerRef}
      className="services-arc-gallery relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: "pan-y", overscrollBehaviorX: "contain" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
      role="region"
      aria-label="Browse electrical services"
    >
      <div
        ref={trackRef}
        className="flex h-full items-start py-2 md:py-4 will-change-transform"
        style={{
          width: "max-content",
          gap,
          paddingLeft: `calc(50% - ${cardWidth / 2}px)`,
          paddingRight: `calc(50% - ${cardWidth / 2}px)`,
          transform: "translate3d(0,0,0)",
        }}
      >
        {galleryServices.map((service, index) => (
          <article
            key={`${service.id}-${index}`}
            ref={(el) => {
              cardsRef.current[index] = el
            }}
            className="flex shrink-0 flex-col items-center will-change-transform pointer-events-none"
            style={{ width: cardWidth }}
          >
            <div
              className={
                isMobile
                  ? "relative w-full h-[260px] overflow-hidden rounded-xl shadow-lg shadow-black/30"
                  : "relative w-full h-[420px] overflow-hidden rounded-xl shadow-lg shadow-black/25"
              }
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                draggable={false}
                className="object-cover pointer-events-none select-none"
                sizes="(max-width: 768px) 72vw, 280px"
              />
            </div>
            <h3
              className={
                isMobile
                  ? "mt-2.5 w-full text-center text-[15px] font-semibold text-white leading-snug px-1"
                  : "mt-4 w-full text-center text-lg font-semibold text-white leading-snug px-1"
              }
            >
              {service.title}
            </h3>
          </article>
        ))}
      </div>
    </div>
  )
}
