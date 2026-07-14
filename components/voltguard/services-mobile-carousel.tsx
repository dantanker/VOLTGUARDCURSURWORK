"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { SERVICES } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function ServicesMobileCarousel() {
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
    <div className="w-full px-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          Swipe to explore
        </p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            disabled={current === 0}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-slate-300 transition-colors disabled:opacity-30"
            aria-label="Previous service"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            disabled={current === SERVICES.length - 1}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-800/80 text-slate-300 transition-colors disabled:opacity-30"
            aria-label="Next service"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: false, dragFree: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {SERVICES.map((service) => (
            <CarouselItem key={service.id} className="pl-3 basis-[88%] sm:basis-[70%]">
              <article className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/70">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 88vw, 70vw"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent px-4 pb-4 pt-16">
                    <h3 className="text-lg font-semibold text-white leading-snug">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-300 line-clamp-2">
                      {service.description}
                    </p>
                    <p className="mt-2 text-sm font-medium text-orange-400">
                      {service.price}
                    </p>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-0.5">
          {SERVICES.map((service, index) => (
            <button
              key={service.id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to ${service.title}`}
              aria-current={current === index}
              className="flex h-9 w-9 items-center justify-center"
            >
              <span
                className={cn(
                  "rounded-full transition-all duration-300",
                  current === index
                    ? "h-2 w-5 bg-orange-500"
                    : "h-2 w-2 bg-slate-600"
                )}
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          {current + 1} of {SERVICES.length}
        </p>
      </div>
    </div>
  )
}
