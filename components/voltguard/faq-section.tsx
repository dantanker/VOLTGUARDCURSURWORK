"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQS } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"
import { FadeInUp, BlurIn } from "@/lib/scroll-animations"

export function FAQSection() {
  const handleAccordionChange = (value: string) => {
    if (value) {
      trackEvent(EVENTS.FAQ_EXPAND, { questionId: value })
    }
  }

  return (
    <section 
      id="faq" 
      className="py-16 md:py-24 scroll-mt-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/voltguard-van-crew-final.jpg-Y1SLg3n7DZKWndRoSAre2lIpjbWMvw.png)',
      }}
    >
      {/* Moderate overlay for readability with bright background image */}
      <div className="absolute inset-0 bg-black/35"></div>
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <FadeInUp delay={0}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-lg">
              Frequently Asked Questions
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-100 drop-shadow">
              Got questions? {"We've"} got answers.
            </p>
          </FadeInUp>
        </div>

        <Accordion 
          type="single" 
          collapsible 
          defaultValue="response-time"
          onValueChange={handleAccordionChange}
          className="space-y-3"
        >
          {FAQS.map((faq, index) => (
            <BlurIn key={faq.id} delay={index * 0.08}>
              <AccordionItem 
                value={faq.id}
                className="bg-white/93 backdrop-blur-md border border-slate-200/60 rounded-lg shadow-md hover:shadow-lg data-[state=open]:shadow-lg transition-all"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4 px-6 group">
                  <span className="text-slate-900 opacity-80 group-hover:opacity-100 transition-opacity">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-800 pb-4 px-6 leading-relaxed font-medium">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </BlurIn>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
