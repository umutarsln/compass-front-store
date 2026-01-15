"use client"

import { motion } from "framer-motion"
import { Shield, Sparkles, Truck } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Güvenli Ödeme",
    description: "256-bit SSL şifreleme ile tüm ödemeleriniz güvende.",
  },
  {
    icon: Sparkles,
    title: "Özel Üretim",
    description: "Her lamba sizin için özel olarak tasarlanır ve üretilir.",
  },
  {
    icon: Truck,
    title: "Hızlı Kargo",
    description: "Türkiye'nin her yerine 3-5 iş günü içinde teslimat.",
  },
]

export function TrustSection() {
  return (
    <section className="py-16 bg-secondary border-y border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-background flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
