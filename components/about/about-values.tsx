"use client"

import { motion } from "framer-motion"
import { Award, Users, Target, Handshake } from "lucide-react"

const values = [
  { icon: Award, title: "Kalite", desc: "Dünya standartlarında ürünler ve hizmetler sunuyoruz." },
  { icon: Handshake, title: "Güvenilirlik", desc: "15 yılı aşkın sektör deneyimiyle yanınızdayız." },
  { icon: Target, title: "Çözüm Odaklılık", desc: "İhtiyaçlarınıza özel, sonuç odaklı çözümler üretiyoruz." },
  { icon: Users, title: "Müşteri Memnuniyeti", desc: "500+ mutlu müşterimiz en büyük referansımızdır." },
]

/**
 * Hakkımızda sayfası değerler bölümü - Forge About UI
 * 4 ikonlu kart
 */
export function AboutValues() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Değerlerimiz</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Bizi Biz Yapan Değerler</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-lg p-6 border border-border text-center shadow-card"
            >
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-lg mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
