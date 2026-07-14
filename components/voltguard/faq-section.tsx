"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ShinyHeading } from "@/components/ShinyText"
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
    <section id="faq" className="relative pt-6 md:pt-8 pb-24 md:pb-24 scroll-mt-24 md:scroll-mt-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <FadeInUp delay={0}>
            <h2 className="mb-4">
              <ShinyHeading
                text="Frequently Asked Questions"
                className="text-2xl sm:text-3xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <p className="text-slate-300">
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
                className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-md hover:shadow-lg data-[state=open]:shadow-lg transition-all"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4 px-6 group">
                  <span className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 pb-4 px-6 leading-relaxed font-medium">
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
