"use client"

import { motion } from "framer-motion"
import Image from "next/image"

/**
 * Hakkımızda metin bölümü — kuruluş 2018 ve 3000+ makine kurulumu vurgusu; iki kolon düzen.
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
              2018&apos;den Beri Üretimin Yanındayız
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Compass Reklam, 2018 yılında endüstriyel baskı teknolojilerine odaklanarak yola çıktı. Akdeniz bölgesi ve
                çevre illerdeki baskı atölyeleri, reklam firmaları ve üretim tesisleriyle kurduğumuz iş birlikleriyle
                güvenilir bir çözüm ortağı haline geldik.
              </p>
              <p>
                Dünya markası üreticilerin yetkili distribütörü olarak UV flatbed, roll-to-roll, DTF, lazer kesim ve
                laminasyon makinelerinde geniş bir ürün yelpazesi sunuyoruz. Bugüne dek{" "}
                <strong className="text-foreground font-medium">toplam 3000&apos;den fazla makine kurulumu</strong>{" "}
                gerçekleştirdik; kurulum, eğitim ve{" "}
                <strong className="text-foreground font-medium">Akdeniz geneli teknik servis</strong> ile satış sonrası
                desteği eksiksiz sunuyoruz.
              </p>
              <p>
                Misyonumuz, baskı sektörünün teknolojik dönüşümüne katkı sağlamak ve müşterilerimizin üretim kapasitesini
                sürdürülebilir biçimde artırmaktır.
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
                alt="Compass Reklam endüstriyel baskı çözümleri"
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
