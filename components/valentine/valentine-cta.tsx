"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Calendar, Truck } from "lucide-react"

export function ValentineCTA() {
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
          <div className="inline-flex items-center gap-2 text-accent mb-6">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm font-medium uppercase tracking-wider">Son Fırsat</span>
            <Heart className="w-5 h-5 fill-current" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Sevdiklerinize Unutulmaz Bir Hediye
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            14 Şubat'a garantili teslimat için siparişinizi 10 Şubat'a kadar verin. Tüm Sevgililer Günü koleksiyonunda
            %20 indirim ve ücretsiz hediye paketi.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kategoriler/sevgiliye-ozel"
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-accent-foreground font-medium text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors"
            >
              Hemen Sipariş Ver
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">10 Şubat Son Sipariş</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Truck className="w-5 h-5" />
              <span className="text-sm">Ücretsiz Kargo</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Heart className="w-5 h-5" />
              <span className="text-sm">Hediye Paketi Dahil</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
