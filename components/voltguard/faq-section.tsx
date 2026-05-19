"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQS } from "@/lib/constants"
import { trackEvent, EVENTS } from "@/lib/analytics"

export function FAQSection() {
  const handleAccordionChange = (value: string) => {
    if (value) {
      trackEvent(EVENTS.FAQ_EXPAND, { questionId: value })
    }
  }

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600">
            Got questions? {"We've"} got answers.
          </p>
        </div>

        <Accordion 
          type="single" 
          collapsible 
          defaultValue="response-time"
          onValueChange={handleAccordionChange}
          className="space-y-4"
        >
          {FAQS.map((faq, index) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className="bg-white border border-slate-200 rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left text-slate-900 font-medium hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 pb-4 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
