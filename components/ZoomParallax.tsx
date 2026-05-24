"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

interface ParallaxImage {
  src: string
  alt?: string
}

interface ZoomParallaxProps {
  images: ParallaxImage[]
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  const positionClasses = [
    "",
    "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]",
    "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]",
    "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]",
    "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]",
    "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]",
    "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]",
  ]

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length]

          return (
            <motion.div
              key={src}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${positionClasses[index] ?? ""}`}
            >
              <div className="relative h-[25vh] w-[25vw] overflow-hidden rounded-xl shadow-xl ring-1 ring-white/10">
                <Image
                  src={src}
                  alt={alt || `Project photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="35vw"
                  draggable={false}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
