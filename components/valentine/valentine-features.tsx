"use client"

import { motion } from "framer-motion"
import { Gift, Heart, Clock, Sparkles } from "lucide-react"

const features = [
  {
    icon: Heart,
    title: "Kişiye Özel",
    description: "Her lamba sizin fotoğrafınızdan özel olarak tasarlanır.",
  },
  {
    icon: Gift,
    title: "Hediye Paketi",
    description: "Özel tasarım kutu ve el yazısı kart ile hediye paketi.",
  },
  {
    icon: Clock,
    title: "Hızlı Teslimat",
    description: "14 Şubat'a garantili teslimat için son sipariş 10 Şubat.",
  },
  {
    icon: Sparkles,
    title: "Premium Kalite",
    description: "Yüksek kalite malzemeler ve uzun ömürlü LED teknolojisi.",
  },
]

export function ValentineFeatures() {
  return (
    <section className="py-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-background text-accent mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
