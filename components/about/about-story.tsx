"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function AboutStory() {
  return (
    <section className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/gifts/unboxing-personalized-lamp-gift-moment.jpg"
                alt="Mutlu müşteri anı"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">Hikayemiz</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight text-balance">
              Bir Fikir, Binlerce Gülümseme
            </h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Shawk, 2020 yılında İstanbul'da küçük bir atölyede başladı. Kurucumuz, sevdiği birine özel bir
                hediye ararken, fotoğrafların ışıkla birleşerek ne kadar büyülü bir etki yaratabileceğini fark etti.
              </p>
              <p>
                O günden bu yana, binlerce aileye, çifte ve arkadaşa anlamlı hediyeler ürettik. Her lamba, bir anının
                ışıkla dans etmesi, bir duygunun kalıcı hale gelmesidir. Shawk ile her ürün, sizin için özel olarak tasarlanır ve üretilir.
              </p>
              <p>
                Bugün, modern 3D baskı teknolojisi ve geleneksel el işçiliğini bir araya getirerek, Türkiye'nin her
                yerine benzersiz ürünler ulaştırıyoruz. Her sipariş, bizim için bir tutku ve sevgi işidir.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
