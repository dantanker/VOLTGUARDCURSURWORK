import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { TESTIMONIALS } from "@/lib/constants"
import { FadeInUp, ExpandIn } from "@/lib/scroll-animations"
import Image from "next/image"

export function SocialProof() {
  return (
    <section className="bg-slate-900 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 mb-12">
          <FadeInUp delay={0}>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2">2,847</p>
              <p className="text-slate-400">Chicago families served this year</p>
            </div>
          </FadeInUp>
          <div className="hidden sm:block w-px h-16 bg-slate-700" />
          <FadeInUp delay={0.1}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-4xl sm:text-5xl font-bold text-white">4.9</span>
                <Star className="w-8 h-8 text-orange-500 fill-orange-500" />
              </div>
              <p className="text-slate-400">Average rating</p>
            </div>
          </FadeInUp>
        </div>

        {/* Section Header */}
        <div className="text-center mb-10">
          <FadeInUp delay={0.2}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
          </FadeInUp>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <ExpandIn key={testimonial.id} delay={index * 0.1}>
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardContent className="pt-6">
                  {/* Customer Image */}
                  {testimonial.image && (
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          fill
                          className="object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  )}
                  
                  <Quote className="w-8 h-8 text-blue-500 mb-4 opacity-50" />
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {`"${testimonial.quote}"`}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                    ))}
                  </div>
                  <p className="text-white font-medium text-center">{testimonial.author}</p>
                  <p className="text-slate-500 text-sm text-center">{testimonial.location}</p>
                </CardContent>
              </Card>
            </ExpandIn>
          ))}
        </div>
      </div>
    </section>
  )
}
