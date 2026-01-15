"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Anılarınız Işıkla Buluşmayı Bekliyor
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Bugün siparişinizi verin, sevdiklerinize unutulmaz bir hediye hazırlayın.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/urunler"
              className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              Hemen Başla
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center px-10 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
            >
              Bize Ulaşın
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
