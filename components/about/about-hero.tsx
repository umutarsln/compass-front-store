"use client"

import { motion } from "framer-motion"
import Image from "next/image"

/**
 * Hakkımızda sayfası hero bölümü - Forge About UI
 * Tam genişlik görsel üzerinde overlay ve başlık
 */
export function AboutHero() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/forge/hero-printer.jpg"
          alt="Compass Reklam hakkında"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/90" />
      </div>
      <div className="container relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-primary font-semibold text-sm uppercase tracking-wider"
        >
          Hakkımızda
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-5xl font-bold text-background mt-3 mb-4"
        >
          Baskı Teknolojisinde <span className="text-gradient">15+ Yıl</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-background/80 max-w-2xl mx-auto text-lg"
        >
          Endüstriyel baskı çözümlerinde Türkiye&apos;nin güvenilir iş ortağı olarak, sektöre değer katmaya devam ediyoruz.
        </motion.p>
      </div>
    </section>
  )
}
