"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function AboutTeam() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">Ekibimiz</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Tutkulu Bir Ekip
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Tasarımcılar, mühendisler ve müşteri temsilcilerinden oluşan tutkulu ekibimiz, her gün anılarınızı ışığa
            dönüştürmek için çalışıyor. Her sipariş bizim için sadece bir ürün değil, bir aşk hikayesi, bir dostluk anısı 
            veya bir aile bağıdır. Shawk ekibi olarak, bu özel anları en güzel şekilde yansıtmak için varız.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <div className="font-serif text-4xl text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground mt-2">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="font-serif text-4xl text-foreground">15</div>
              <div className="text-sm text-muted-foreground mt-2">Ekip Üyesi</div>
            </div>
            <div>
              <div className="font-serif text-4xl text-foreground">4.9</div>
              <div className="text-sm text-muted-foreground mt-2">Ortalama Puan</div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              Bize Ulaşın
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
