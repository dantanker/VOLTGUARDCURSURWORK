"use client"

import { ImageComparison } from "@/components/ImageComparison"
import { ZoomParallax } from "@/components/ZoomParallax"
import { ShinyHeading } from "@/components/ShinyText"
import { FadeInUp } from "@/lib/scroll-animations"

const GALLERY_ITEMS = [
  {
    id: "network-rack",
    title: "Commercial Network Rack",
    subtitle: "Structured cabling & rack organization",
    before: {
      src: "/gallery/rack-before.png",
      alt: "Disorganized network rack with tangled cables before VoltGuard service",
    },
    after: {
      src: "/gallery/rack-after.png",
      alt: "Neatly organized network rack with professional cable management after VoltGuard service",
    },
  },
  {
    id: "electrical-panel",
    title: "Electrical Panel Upgrade",
    subtitle: "Legacy fuse box to modern smart load center",
    before: {
      src: "/gallery/panel-before.png",
      alt: "Outdated residential fuse box before panel upgrade",
    },
    after: {
      src: "/gallery/panel-after.png",
      alt: "Modern smart electrical panel with organized wiring after upgrade",
    },
  },
] as const

const PARALLAX_IMAGES = [
  {
    src: "/gallery/parallax/van.png",
    alt: "VoltGuard company van — Power Done Right",
  },
  {
    src: "/gallery/parallax/industrial.png",
    alt: "Industrial electrical conduit and panel installation in a warehouse",
  },
  {
    src: "/gallery/parallax/office.png",
    alt: "Commercial office lighting installation with city views at night",
  },
  {
    src: "/gallery/parallax/kitchen-lighting.png",
    alt: "Residential kitchen recessed and under-cabinet lighting",
  },
  {
    src: "/gallery/parallax/panel.png",
    alt: "Neatly wired residential electrical panel in a garage",
  },
  {
    src: "/gallery/parallax/ev-charger.png",
    alt: "EV charger installation in a residential garage",
  },
  {
    src: "/gallery/parallax/commercial-kitchen.png",
    alt: "Commercial kitchen electrical outlet and conduit work",
  },
] as const

function GalleryComparison({
  title,
  subtitle,
  before,
  after,
  delay,
}: {
  title: string
  subtitle: string
  before: { src: string; alt: string }
  after: { src: string; alt: string }
  delay: number
}) {
  return (
    <FadeInUp delay={delay}>
      <article className="relative w-full min-w-0">
        <div className="relative">
          <ImageComparison
            beforeImage={before.src}
            afterImage={after.src}
            altBefore={before.alt}
            altAfter={after.alt}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4">
            <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
            <p className="mt-0.5 text-xs text-slate-300 leading-snug sm:text-sm">{subtitle}</p>
          </div>
        </div>
      </article>
    </FadeInUp>
  )
}

export function GallerySection() {
  return (
    <section id="gallery" className="relative scroll-mt-20 py-6 md:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-7">
          <FadeInUp delay={0}>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-500 mb-1.5">
              Our Work
            </p>
            <h2 className="mb-2">
              <ShinyHeading
                text="Gallery"
                className="text-2xl sm:text-3xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Drag to compare — before on the left, after on the right.
            </p>
          </FadeInUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryComparison
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              before={item.before}
              after={item.after}
              delay={0.1 + index * 0.06}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 md:mt-8">
        <ZoomParallax images={[...PARALLAX_IMAGES]} />
      </div>
    </section>
  )
}
