"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ImageComparison } from "@/components/ImageComparison"
import { ZoomParallax, type ParallaxImage } from "@/components/ZoomParallax"
import { ShinyHeading } from "@/components/ShinyText"
import { FadeInUp } from "@/lib/scroll-animations"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const GALLERY_ITEMS = [
  {
    id: "network-rack",
    title: "Commercial Network Rack",
    subtitle: "Structured cabling & rack organization",
    description:
      "We took a tangled commercial rack and turned it into labeled, serviceable cable runs. Clean, organized, and ready for the next tech visit.",
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
    description:
      "We replaced an aging fuse box with a modern load center. Clean terminations, clear labels, and power sized for how you live today.",
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
  },
  {
    src: "/gallery/parallax/industrial.png",
    alt: "Industrial electrical conduit and panel installation in a warehouse",
    caption: "Warehouse conduit install",
    description:
      "Conduit and panel feeds run for a busy warehouse floor. Built strong for heavy loads and easy to service when you need us again.",
  },
  {
    src: "/gallery/parallax/office.png",
    alt: "Commercial office lighting installation with city views at night",
    caption: "Office lighting retrofit",
    description:
      "We swapped outdated office lighting for bright, even coverage. Code compliant, finished clean, and ready for a long workday.",
  },
  {
    src: "/gallery/parallax/kitchen-lighting.png",
    alt: "Residential kitchen recessed and under-cabinet lighting",
    caption: "Kitchen lighting install",
    description:
      "Recessed and under cabinet lights installed in a home kitchen. Flush cans, neat trim, and a finish that looks intentional.",
  },
  {
    src: "/gallery/parallax/panel.png",
    alt: "Open residential electrical panel with labeled circuit directory in a garage",
    caption: "Panel tidy-up & upgrade",
    description:
      "A clean residential panel with a fully labeled circuit directory. Easy to read, easy to service, and finished the right way.",
  },
  {
    src: "/gallery/parallax/ev-charger.png",
    alt: "EV charger installation in a residential garage",
    caption: "EV charger install",
    description:
      "Level 2 home charger installed on a dedicated circuit. Sized for daily charging so your home stays safe and reliable.",
  },
  {
    src: "/gallery/parallax/commercial-kitchen.png",
    alt: "Commercial kitchen electrical outlet and conduit work",
    caption: "Restaurant kitchen power",
    description:
      "Hardwired outlets and conduit for commercial kitchen equipment. Built to handle heat, grease, and the loads a busy kitchen demands.",
  },
] as const

type ProjectPhoto = (typeof PROJECT_PHOTOS)[number]

function GalleryPhotoDialog({
  photo,
  open,
  onOpenChange,
}: {
  photo: ProjectPhoto | ParallaxImage | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const title = photo?.caption ?? "Project photo"
  const description = photo?.description ?? ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[200] bg-black/70" />
        <DialogPrimitive.Content
          className="fixed top-1/2 left-1/2 z-[201] grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden rounded-xl border border-white/10 bg-slate-950 p-0 text-white shadow-2xl outline-none sm:max-w-xl"
        >
          {photo ? (
            <>
              <div className="relative aspect-[4/3] w-full bg-slate-900">
                <Image
                  src={photo.src}
                  alt={photo.alt || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 576px"
                  priority
                />
              </div>
              <DialogHeader className="gap-2 px-5 pb-5 pt-4 text-left">
                <DialogTitle className="text-lg text-white">{title}</DialogTitle>
                {description ? (
                  <DialogDescription className="text-sm leading-relaxed text-slate-300">
                    {description}
                  </DialogDescription>
                ) : null}
              </DialogHeader>
            </>
          ) : null}
          <DialogPrimitive.Close className="absolute top-3 right-3 z-10 rounded-full bg-black/55 p-2 text-white opacity-100 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

function GalleryComparison({
  title,
  subtitle,
  description,
  before,
  after,
  delay,
}: {
  title: string
  subtitle: string
  description: string
  before: { src: string; alt: string }
  after: { src: string; alt: string }
  delay: number
}) {
  const [open, setOpen] = useState(false)

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
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className="pointer-events-auto w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70"
            >
              <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
              <p className="mt-0.5 text-xs text-slate-300 leading-snug sm:text-sm">{subtitle}</p>
              <p
                className={cn(
                  "overflow-hidden text-xs leading-snug text-slate-300/95 transition-all duration-300 sm:text-sm",
                  open ? "mt-2 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0"
                )}
              >
                {description}
              </p>
            </button>
          </div>
        </div>
      </article>
    </FadeInUp>
  )
}

function MobileProjectPhotos({
  onPhotoClick,
}: {
  onPhotoClick: (photo: ProjectPhoto) => void
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

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
          {PROJECT_PHOTOS.map((photo) => {
            const canOpen = Boolean(photo.caption && photo.description)

            return (
              <CarouselItem key={photo.src} className="pl-3 basis-[90%]">
                {canOpen ? (
                  <button
                    type="button"
                    onPointerDown={(event) => {
                      pointerStart.current = {
                        x: event.clientX,
                        y: event.clientY,
                      }
                    }}
                    onClick={(event) => {
                      const start = pointerStart.current
                      pointerStart.current = null
                      if (
                        start &&
                        (Math.abs(event.clientX - start.x) > 8 ||
                          Math.abs(event.clientY - start.y) > 8)
                      ) {
                        return
                      }
                      onPhotoClick(photo)
                    }}
                    aria-label={`View details for ${photo.caption}`}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl text-left ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="90vw"
                      draggable={false}
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-3 pb-3 pt-10">
                      <p className="text-sm font-semibold text-white">
                        {photo.caption}
                      </p>
                    </div>
                  </button>
                ) : (
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
                )}
              </CarouselItem>
            )
          })}
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
  const [open, setOpen] = useState(false)
  const active = GALLERY_ITEMS.find((item) => item.id === activeId) ?? GALLERY_ITEMS[0]

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {GALLERY_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveId(item.id)
              setOpen(false)
            }}
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
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className="pointer-events-auto w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70"
            >
              <h3 className="text-sm font-semibold text-white">{active.title}</h3>
              <p className="mt-0.5 text-xs text-slate-300 leading-snug">{active.subtitle}</p>
              <p
                className={cn(
                  "overflow-hidden text-xs leading-snug text-slate-300/95 transition-all duration-300",
                  open ? "mt-2 max-h-24 opacity-100" : "mt-0 max-h-0 opacity-0"
                )}
              >
                {active.description}
              </p>
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<ProjectPhoto | ParallaxImage | null>(
    null
  )

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
          <MobileProjectPhotos onPhotoClick={setSelectedPhoto} />
        </div>

        {/* Desktop before/after grid */}
        <div className="hidden md:grid grid-cols-2 gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryComparison
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              description={item.description}
              before={item.before}
              after={item.after}
              delay={0.1 + index * 0.06}
            />
          ))}
        </div>
      </div>

      {/* Desktop parallax only — too heavy / awkward on phones */}
      <div className="mt-8 hidden md:block">
        <ZoomParallax
          images={[...PROJECT_PHOTOS]}
          onImageClick={setSelectedPhoto}
        />
      </div>

      <GalleryPhotoDialog
        photo={selectedPhoto}
        open={Boolean(selectedPhoto)}
        onOpenChange={(open) => {
          if (!open) setSelectedPhoto(null)
        }}
      />
    </section>
  )
}
