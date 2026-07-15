"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
} from "framer-motion"
import "./ShinyText.css"

type ShinyTextProps = {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
  spread?: number
  yoyo?: boolean
  pauseOnHover?: boolean
  direction?: "left" | "right"
  delay?: number
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}: ShinyTextProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)
  const isVisibleRef = useRef(true)
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const directionRef = useRef(direction === "left" ? 1 : -1)

  const animationDuration = speed * 1000
  const delayDuration = delay * 1000

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)")
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const el = spanRef.current
    if (!el || reduceMotion) return
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { rootMargin: "40px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduceMotion])

  useAnimationFrame((time) => {
    if (disabled || isPaused || reduceMotion || !isVisibleRef.current) {
      lastTimeRef.current = null
      return
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
      return
    }

    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time

    elapsedRef.current += deltaTime

    if (yoyo) {
      const cycleDuration = animationDuration + delayDuration
      const fullCycle = cycleDuration * 2
      const cycleTime = elapsedRef.current % fullCycle

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100
        progress.set(directionRef.current === 1 ? p : 100 - p)
      } else if (cycleTime < cycleDuration) {
        progress.set(directionRef.current === 1 ? 100 : 0)
      } else if (cycleTime < cycleDuration + animationDuration) {
        const reverseTime = cycleTime - cycleDuration
        const p = 100 - (reverseTime / animationDuration) * 100
        progress.set(directionRef.current === 1 ? p : 100 - p)
      } else {
        progress.set(directionRef.current === 1 ? 0 : 100)
      }
    } else {
      const cycleDuration = animationDuration + delayDuration
      const cycleTime = elapsedRef.current % cycleDuration

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100
        progress.set(directionRef.current === 1 ? p : 100 - p)
      } else {
        progress.set(directionRef.current === 1 ? 100 : 0)
      }
    }
  })

  useEffect(() => {
    directionRef.current = direction === "left" ? 1 : -1
    elapsedRef.current = 0
    progress.set(0)
  }, [direction, progress])

  const backgroundPosition = useTransform(
    progress,
    (p) => `${150 - p * 2}% center`
  )

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true)
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false)
  }, [pauseOnHover])

  const gradientStyle = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as const

  if (reduceMotion) {
    return (
      <span
        ref={spanRef}
        className={className}
        style={{ color }}
      >
        {text}
      </span>
    )
  }

  return (
    <motion.span
      ref={spanRef}
      className={`shiny-text ${className}`}
      style={{ ...gradientStyle, backgroundPosition }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  )
}

const HEADING_SHINE = {
  color: "#cbd5e1",
  shineColor: "#ffffff",
  speed: 2,
  spread: 120,
  direction: "left" as const,
  delay: 0,
  yoyo: false,
  pauseOnHover: false,
}

export function ShinyHeading({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  return (
    <ShinyText text={text} className={className} {...HEADING_SHINE} />
  )
}
