"use client"

import { motion } from "framer-motion"

const milestones = [
  { year: "2010", text: "Compass Reklam kuruldu" },
  { year: "2013", text: "İlk yetkili distribütörlük anlaşması" },
  { year: "2016", text: "Teknik servis ağı genişletildi" },
  { year: "2019", text: "500. makine kurulumu tamamlandı" },
  { year: "2022", text: "Yeni nesil UV ve DTF ürün portföyü" },
  { year: "2025", text: "1000+ kurulu makine ve Türkiye geneli hizmet" },
]

/**
 * Hakkımızda sayfası kilometre taşları bölümü - Forge About UI
 */
export function AboutTimeline() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Kilometre Taşları</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Gelişim Yolculuğumuz</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="shrink-0 w-20 text-right">
                <span className="font-display font-bold text-primary text-lg">{m.year}</span>
              </div>
              <div className="h-3 w-3 rounded-full bg-primary shrink-0" />
              <div className="flex-1 bg-card rounded-lg p-4 border border-border shadow-card">
                <p className="text-sm text-foreground">{m.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
