"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "15+", label: "Yıl Tecrübe" },
  { value: "500+", label: "Mutlu Müşteri" },
  { value: "1000+", label: "Kurulu Makine" },
  { value: "50+", label: "Uzman Kadro" },
]

/**
 * Hakkımızda sayfası istatistik şeridi - Forge About UI
 */
export function AboutStats() {
  return (
    <section className="py-16 bg-gradient-primary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/80 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
