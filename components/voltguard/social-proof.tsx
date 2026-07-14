"use client"

import clsx from "clsx"
import Image from "next/image"
import { Star } from "lucide-react"
import { ScrollObserver } from "@/components/ScrollObserver"
import { SOCIAL_LINKS, TESTIMONIALS } from "@/lib/constants"

const REVIEW_SOURCES = SOCIAL_LINKS.filter(
  (link) => link.shortLabel === "Google" || link.shortLabel === "Yelp"
)

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function YelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FF1A1A" aria-hidden>
      <path d="M12.271 15.068l-2.45 7.038a.588.588 0 0 1-1.101-.151l.957-3.294-2.063-1.19a.588.588 0 0 1 .303-1.089l7.228-1.043 2.127-6.127a.588.588 0 0 1 1.101.151l-.957 3.294 2.063 1.19a.588.588 0 0 1-.303 1.089l-7.228 1.043-2.127 6.127z" />
    </svg>
  )
}

function ReviewSourceIcon({ label }: { label: string }) {
  if (label === "Google") return <GoogleIcon className="h-3.5 w-3.5 shrink-0" />
  if (label === "Yelp") return <YelpIcon className="h-3.5 w-3.5 shrink-0" />
  return null
}

function ReviewSourceBadge({
  source,
  align,
}: {
  source: (typeof REVIEW_SOURCES)[number]
  align: "left" | "right"
}) {
  return (
    <a
      href={source.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={source.label}
      className={clsx(
        "group flex shrink-0 flex-col gap-1 transition-opacity hover:opacity-100",
        align === "left" ? "items-start" : "items-end",
        "opacity-90"
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-800/60 px-2.5 py-1 text-[11px] font-medium text-slate-200 transition-colors group-hover:border-slate-500 group-hover:text-white">
        <ReviewSourceIcon label={source.shortLabel} />
        {source.shortLabel}
      </span>
      <span className="text-[10px] text-slate-500">Verified</span>
    </a>
  )
}

function ReviewStats({ compact = false }: { compact?: boolean }) {
  const google = REVIEW_SOURCES.find((s) => s.shortLabel === "Google")!
  const yelp = REVIEW_SOURCES.find((s) => s.shortLabel === "Yelp")!

  return (
    <div
      className={clsx(
        "w-full max-w-md",
        compact ? "pt-3" : "border-t border-slate-800 pt-6 mt-8"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <ReviewSourceBadge source={google} align="left" />

        <div className="min-w-0 flex-1 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span
              className={clsx(
                "font-bold text-white tabular-nums",
                compact ? "text-xl" : "text-2xl sm:text-3xl"
              )}
            >
              4.9
            </span>
            <div className="flex items-center gap-px">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={clsx(
                    "text-orange-500 fill-orange-500",
                    compact ? "w-3 h-3" : "w-3.5 h-3.5"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 sm:text-xs">Average rating</p>
        </div>

        <ReviewSourceBadge source={yelp} align="right" />
      </div>
    </div>
  )
}

export function SocialProof() {
  return (
    <section id="testimonials" className="relative scroll-mt-24 md:scroll-mt-40 pt-4 md:pt-6 pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop */}
        <div className="hidden lg:block">
          <ScrollObserver
            className="relative grid grid-cols-2 gap-10 xl:gap-14"
            defaultActiveId={`review-${TESTIMONIALS[0].id}`}
          >
            {(isHidden) => (
              <>
                <ScrollObserver.TriggerGroup className="pb-[50vh]">
                  {TESTIMONIALS.map((testimonial, index) => (
                    <ScrollObserver.Trigger
                      id={`review-${testimonial.id}`}
                      key={testimonial.id}
                      className={clsx(
                        "relative min-h-screen flex items-center justify-center",
                        index > 0 && "scroll-mt-[50vh]"
                      )}
                    >
                      {(isActive) => (
                        <div
                          className={clsx(
                            isActive ? "text-white" : "text-white/15 hover:text-white/35",
                            "relative w-full rounded-2xl p-6 xl:p-8 transition-colors duration-300",
                            isActive && "bg-white/5"
                          )}
                        >
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={clsx(
                                  "w-4 h-4",
                                  isActive
                                    ? "text-orange-500 fill-orange-500"
                                    : "text-white/20 fill-white/20"
                                )}
                              />
                            ))}
                          </div>
                          <blockquote className="text-2xl xl:text-3xl font-bold leading-snug mb-5">
                            &ldquo;{testimonial.quote}&rdquo;
                          </blockquote>
                          <p className="text-lg font-semibold">{testimonial.author}</p>
                          <p className="text-slate-400 mt-1">{testimonial.location}</p>
                        </div>
                      )}
                    </ScrollObserver.Trigger>
                  ))}
                </ScrollObserver.TriggerGroup>

                <div className="sticky top-0 h-screen flex flex-col items-center justify-center self-start px-2">
                  <h2 className="text-2xl xl:text-[2rem] font-bold text-white text-center mb-4 max-w-md shrink-0">
                    Real Stories. Real Proof
                  </h2>

                  <div className="relative w-full max-w-md h-[min(42vh,420px)] min-h-[240px] shrink-0">
                    <div
                      className={clsx(
                        { "opacity-100": isHidden, "opacity-0": !isHidden },
                        "absolute inset-0 flex items-center transition-opacity duration-500"
                      )}
                    >
                      <div className="h-full w-full rounded-3xl bg-white/10 border border-white/10" />
                    </div>

                    <ScrollObserver.ReactorGroup className="absolute inset-0">
                      {TESTIMONIALS.map((testimonial) => (
                        <ScrollObserver.Reactor
                          key={testimonial.id}
                          id={`review-${testimonial.id}`}
                        >
                          {() => (
                            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/15">
                              <Image
                                src={testimonial.image}
                                alt={testimonial.author}
                                fill
                                className="object-cover"
                                sizes="400px"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-12">
                                <p className="text-white font-semibold text-lg">
                                  {testimonial.author}
                                </p>
                                <p className="text-slate-300 text-sm">{testimonial.location}</p>
                              </div>
                            </div>
                          )}
                        </ScrollObserver.Reactor>
                      ))}
                    </ScrollObserver.ReactorGroup>
                  </div>

                  <ReviewStats compact />
                </div>
              </>
            )}
          </ScrollObserver>
        </div>

        {/* Mobile / tablet */}
        <div className="lg:hidden">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Real Stories. Real Proof
          </h2>
          <div className="space-y-10">
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-2xl overflow-hidden bg-slate-800/60 border border-slate-700"
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                    ))}
                  </div>
                  <blockquote className="text-slate-200 leading-relaxed mb-4">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-slate-500 text-sm">{testimonial.location}</p>
                </div>
              </article>
            ))}
          </div>
          <ReviewStats />
        </div>
      </div>
    </section>
  )
}
