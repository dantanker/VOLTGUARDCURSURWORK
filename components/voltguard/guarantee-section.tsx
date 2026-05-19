import { Clock, Shield, BadgePercent } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { WARRANTY_YEARS } from "@/lib/constants"

const guarantees = [
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Book by 2 PM, we'll be there today.",
  },
  {
    icon: Shield,
    title: `${WARRANTY_YEARS}-Year Warranty`,
    description: "All repairs backed by our written guarantee.",
  },
  {
    icon: BadgePercent,
    title: "Price Match",
    description: "Found a lower quote? We'll beat it by 10%.",
  },
]

export function GuaranteeSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Our Guarantees to You
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We stand behind our work. Period. {"Here's"} our promise to every customer.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {guarantees.map((guarantee) => (
            <Card 
              key={guarantee.title}
              className="bg-white border-slate-200 shadow-sm text-center"
            >
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <guarantee.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {guarantee.title}
                </h3>
                <p className="text-slate-600">
                  {guarantee.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
