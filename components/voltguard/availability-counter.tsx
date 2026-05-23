"use client"

import { useState, useEffect } from "react"
import { Circle } from "lucide-react"

export function AvailabilityCounter() {
  const [technicianCount, setTechnicianCount] = useState(3)

  useEffect(() => {
    const calculateTechnicianCount = () => {
      const hour = new Date().getHours()
      // Business hours (7am-9pm): more technicians
      // Night hours: fewer technicians
      if (hour >= 7 && hour < 9) {
        return 2 + Math.floor(Math.random() * 2) // 2-3
      } else if (hour >= 9 && hour < 17) {
        return 3 + Math.floor(Math.random() * 3) // 3-5
      } else if (hour >= 17 && hour < 21) {
        return 2 + Math.floor(Math.random() * 3) // 2-4
      } else {
        return 2 + Math.floor(Math.random() * 2) // 2-3 (night shift)
      }
    }

    setTechnicianCount(calculateTechnicianCount())

    // Update every 30 seconds for "live" feel
    const interval = setInterval(() => {
      setTechnicianCount(calculateTechnicianCount())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <Circle className="relative h-3 w-3 fill-green-500 text-green-500" />
      </span>
      <span className="text-green-400 font-medium">
        {technicianCount} Technician{technicianCount !== 1 ? "s" : ""} Available Now
      </span>
    </div>
  )
}
