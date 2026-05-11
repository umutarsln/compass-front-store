"use client"

import { motion } from "framer-motion"

/** Kuruluş 2018; makine eşikleri (1000 / 2000 / 3000) ve 2026 güncellemesi metinlerle uyumludur. */
const milestones = [
  { year: "2018", text: "Compass Reklam kuruldu; endüstriyel baskı makinelerinde faaliyete başlandı" },
  { year: "2019", text: "Yetkili distribütörlük ve kurulum süreçleriyle müşteri tabanı hızla genişledi" },
  { year: "2020", text: "1000. makine kurulumu tamamlandı; saha ekipleri ve kurulum kapasitesi önemli ölçüde güçlendi" },
  { year: "2021", text: "Türkiye geneli teknik servis ve saha desteği yapılandırıldı; bölgesel müdahale süreleri iyileştirildi" },
  { year: "2023", text: "UV, DTF ve kesim portföyünde ürün gamı genişletildi; kurulum hacmi sürekli arttı" },
  { year: "2024", text: "2000. makine kurulumu gerçekleştirildi; eğitim ve devreye alma süreçleri standartlaştırıldı" },
  { year: "2025", text: "Toplam 3000 makine kurulumu tamamlandı; satış sonrası destek ağı sürekli büyüyor" },
  {
    year: "2026",
    text: "Dijital servis randevusu ve uzaktan teşhis altyapısı devreye alındı; Türkiye geneli yedek parça erişimi güçlendirildi",
  },
]

/**
 * Hakkımızda sayfası kilometre taşları bölümü — kuruluş 2018, makine eşikleri ve Türkiye geneli servis odağı.
 */
export function AboutTimeline() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Kilometre Taşları</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Gelişim Yolculuğumuz</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-sm leading-relaxed">
            2018&apos;de çıktığımız yolda bininci, ikinci ve üçüncü binlik kurulumları tamamladık; Türkiye genelinde servis
            ağımızla müşterilerimizin üretimine eşlik ediyoruz.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
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
