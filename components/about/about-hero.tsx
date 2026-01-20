"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Hakkımızda</p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance">
              Anılarınızı Işığa Dönüştürüyoruz
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Shawk olarak, sevdiklerinizle paylaştığınız özel anları kalıcı birer sanat eserine çeviriyoruz. Her
              lamba, bir hikaye anlatır ve her ışık, bir duygu taşır. Sizin için özel olarak tasarlanan her ürün, 
              sevginizi ve anılarınızı somutlaştırır, evinizde sıcak bir atmosfer yaratır.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/hakkimizda/hakkımızdagorsel1.png"
                alt="El işçiliği LED lamba üretimi"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
