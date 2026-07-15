"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ImageComparison } from "@/components/ImageComparison"
import { ZoomParallax } from "@/components/ZoomParallax"
import { ShinyHeading } from "@/components/ShinyText"
import { FadeInUp } from "@/lib/scroll-animations"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

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

const PROJECT_PHOTOS = [
  {
    src: "/gallery/parallax/van.png",
    alt: "VoltGuard company van — Power Done Right",
    label: "On the job",
  },
  {
    src: "/gallery/parallax/industrial.png",
    alt: "Industrial electrical conduit and panel installation in a warehouse",
    label: "Industrial",
  },
  {
    src: "/gallery/parallax/office.png",
    alt: "Commercial office lighting installation with city views at night",
    label: "Commercial lighting",
  },
  {
    src: "/gallery/parallax/kitchen-lighting.png",
    alt: "Residential kitchen recessed and under-cabinet lighting",
    label: "Kitchen lighting",
  },
  {
    src: "/gallery/parallax/panel.png",
    alt: "Neatly wired residential electrical panel in a garage",
    label: "Panel work",
  },
  {
    src: "/gallery/parallax/ev-charger.png",
    alt: "EV charger installation in a residential garage",
    label: "EV charging",
  },
  {
    src: "/gallery/parallax/commercial-kitchen.png",
    alt: "Commercial kitchen electrical outlet and conduit work",
    label: "Commercial kitchen",
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
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
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

function MobileProjectPhotos() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onSelect)
    }
  }, [api])

  return (
    <div className="mt-8">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: false,
          dragFree: false,
          dragThreshold: 12,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {PROJECT_PHOTOS.map((photo) => (
            <CarouselItem key={photo.src} className="pl-3 basis-[90%]">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="90vw"
                  draggable={false}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex items-center justify-center gap-2">
        {PROJECT_PHOTOS.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Photo ${index + 1}`}
            className="p-1.5"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                current === index
                  ? "h-1.5 w-5 bg-orange-500"
                  : "h-1.5 w-1.5 bg-slate-600"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function MobileBeforeAfterTabs() {
  const [activeId, setActiveId] = useState<(typeof GALLERY_ITEMS)[number]["id"]>(
    GALLERY_ITEMS[0].id
  )
  const active = GALLERY_ITEMS.find((item) => item.id === activeId) ?? GALLERY_ITEMS[0]

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {GALLERY_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={cn(
              "min-h-10 flex-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              activeId === item.id
                ? "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40"
                : "bg-slate-800/80 text-slate-400 ring-1 ring-slate-700/60"
            )}
          >
            {item.id === "network-rack" ? "Network Rack" : "Panel Upgrade"}
          </button>
        ))}
      </div>

      <article className="overflow-hidden rounded-2xl ring-1 ring-white/10">
        <div className="relative">
          <ImageComparison
            beforeImage={active.before.src}
            afterImage={active.after.src}
            altBefore={active.before.alt}
            altAfter={active.after.alt}
            className="aspect-[5/4] rounded-none"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3.5 pt-12">
            <h3 className="text-sm font-semibold text-white">{active.title}</h3>
          </div>
        </div>
      </article>
    </div>
  )
}

export function GallerySection() {
  return (
    <section id="gallery" className="relative scroll-mt-24 md:scroll-mt-40 py-8 md:py-8">
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
            <p className="hidden md:block text-slate-300 max-w-2xl mx-auto text-base">
              Slide to witness the VoltGuard transformation
            </p>
          </FadeInUp>
        </div>

        {/* Mobile gallery */}
        <div className="space-y-2 md:hidden">
          <MobileBeforeAfterTabs />
          <MobileProjectPhotos />
        </div>

        {/* Desktop before/after grid */}
        <div className="hidden md:grid grid-cols-2 gap-6">
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

      {/* Desktop parallax only — too heavy / awkward on phones */}
      <div className="mt-8 hidden md:block">
        <ZoomParallax images={[...PROJECT_PHOTOS]} />
      </div>
    </section>
  )
}
