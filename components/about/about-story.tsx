"use client"

import { motion } from "framer-motion"
import Image from "next/image"

/**
 * Hakkımızda sayfası hikaye bölümü - Forge About UI
 * 2 kolon: metin sol, görsel sağ
 */
export function AboutStory() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Hikayemiz</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Tutkuyla Başladık, Güvenle Büyüdük
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                2010 yılında İstanbul&apos;da küçük bir ofisten yola çıkan Compass Reklam, bugün Türkiye&apos;nin dört bir yanındaki
                baskı atölyeleri, reklam ajansları ve üretim şirketlerine hizmet veren lider bir çözüm ortağı haline gelmiştir.
              </p>
              <p>
                Dünya markası üreticilerin yetkili distribütörü olarak, UV flatbed, roll-to-roll, DTF, lazer kesim ve laminasyon
                makinelerinde geniş bir ürün yelpazesi sunuyoruz. Her makineyi sadece satmıyor; kurulum, eğitim ve satış
                sonrası teknik destekle müşterilerimizin yanında yer alıyoruz.
              </p>
              <p>
                Misyonumuz, Türkiye&apos;deki baskı sektörünün teknolojik dönüşümüne öncülük etmek ve müşterilerimizin rekabet
                gücünü artırmaktır.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-[4/3] w-full rounded-lg shadow-elevated overflow-hidden">
              <Image
                src="/images/forge/product-flatbed.jpg"
                alt="Compass Reklam ekibi"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
