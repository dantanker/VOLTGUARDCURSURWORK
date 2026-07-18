"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

export interface ParallaxImage {
  src: string
  alt?: string
  caption?: string
  description?: string
}

interface ZoomParallaxProps {
  images: ParallaxImage[]
  onImageClick?: (image: ParallaxImage) => void
}

export function ZoomParallax({ images, onImageClick }: ZoomParallaxProps) {
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
    "[&>*]:!-top-[30vh] [&>*]:!left-[5vw] [&>*]:!h-[30vh] [&>*]:!w-[35vw]",
    "[&>*]:!-top-[10vh] [&>*]:!-left-[25vw] [&>*]:!h-[45vh] [&>*]:!w-[20vw]",
    "[&>*]:!left-[27.5vw] [&>*]:!h-[25vh] [&>*]:!w-[25vw]",
    "[&>*]:!top-[27.5vh] [&>*]:!left-[5vw] [&>*]:!h-[25vh] [&>*]:!w-[20vw]",
    "[&>*]:!top-[27.5vh] [&>*]:!-left-[22.5vw] [&>*]:!h-[25vh] [&>*]:!w-[30vw]",
    "[&>*]:!top-[22.5vh] [&>*]:!left-[25vw] [&>*]:!h-[15vh] [&>*]:!w-[15vw]",
  ]

  return (
    <div ref={container} className="relative h-[180vh] md:h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map((image, index) => {
          const { src, alt, caption, description } = image
          const scale = scales[index % scales.length]
          const interactive = Boolean(onImageClick && description)

          return (
            <motion.div
              key={src}
              style={{ scale }}
              className={`pointer-events-none absolute top-0 flex h-full w-full items-center justify-center ${positionClasses[index] ?? ""}`}
            >
              {interactive ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onImageClick?.(image)
                  }}
                  aria-label={`View details for ${caption ?? "project photo"}`}
                  className="pointer-events-auto relative h-[28vh] w-[42vw] cursor-pointer overflow-hidden rounded-xl text-left shadow-xl ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 md:h-[25vh] md:w-[25vw]"
                >
                  <Image
                    src={src}
                    alt={alt || `Project photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 55vw, 35vw"
                    draggable={false}
                  />
                  {caption ? (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-2.5 pt-8">
                      <p className="text-xs font-semibold text-white md:text-sm">
                        {caption}
                      </p>
                    </div>
                  ) : null}
                </button>
              ) : (
                <div className="relative h-[28vh] w-[42vw] overflow-hidden rounded-xl shadow-xl ring-1 ring-white/10 md:h-[25vh] md:w-[25vw]">
                  <Image
                    src={src}
                    alt={alt || `Project photo ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 55vw, 35vw"
                    draggable={false}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
