"use client"

import { motion } from "framer-motion"
import Image from "next/image"

/**
 * Hakkımızda metin bölümü — Türkiye geneli servis ve ana ürün grupları vurgusu; iki kolon düzen.
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
                Compass Reklam, 2018 yılında endüstriyel baskı teknolojilerine odaklanarak yola çıktı. Türkiye genelindeki
                baskı atölyeleri, reklam firmaları ve üretim tesisleriyle kurduğumuz iş birlikleriyle
                güvenilir bir çözüm ortağı haline geldik.
              </p>
              <p>
                Dünya markası üreticilerin yetkili distribütörü olarak ana ürünümüz{" "}
                <strong className="text-foreground font-medium">Folyo kesim makinesi</strong> başta olmak üzere{" "}
                <strong className="text-foreground font-medium">UV flatbed</strong>,{" "}
                <strong className="text-foreground font-medium">roll-to-roll</strong>,{" "}
                <strong className="text-foreground font-medium">DTF</strong>,{" "}
                <strong className="text-foreground font-medium">lazer kesim</strong>,{" "}
                <strong className="text-foreground font-medium">laminasyon makinesi</strong>,{" "}
                <strong className="text-foreground font-medium">PPF makinesi</strong>,{" "}
                <strong className="text-foreground font-medium">Precut PPF</strong> ve{" "}
                <strong className="text-foreground font-medium">cam kesim makinesi</strong> gibi geniş bir ürün yelpazesi
                sunuyoruz. Bugüne dek{" "}
                <strong className="text-foreground font-medium">toplam 3000&apos;den fazla makine kurulumu</strong>{" "}
                gerçekleştirdik; kurulum, eğitim ve{" "}
                <strong className="text-foreground font-medium">Türkiye geneli teknik servis</strong> ile satış sonrası
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
