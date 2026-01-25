"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const steps = [
  {
    number: "01",
    title: "Tasarım",
    description: "Fotoğrafınız uzman tasarımcılarımız tarafından 3D modele dönüştürülür.",
  },
  {
    number: "02",
    title: "Üretim",
    description: "En son teknoloji 3D yazıcılarla yüksek kaliteli malzemeden üretilir.",
  },
  {
    number: "03",
    title: "Montaj",
    description: "LED aydınlatma sistemi el işçiliğiyle titizlikle monte edilir.",
  },
  {
    number: "04",
    title: "Kalite Kontrol",
    description: "Her ürün gönderilmeden önce detaylı kalite kontrolünden geçer.",
  },
]

export function AboutProcess() {
  return (
    <section className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">Üretim Süreci</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight text-balance mb-12">
              Fotoğraftan Lambaya
            </h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="font-serif text-4xl text-border flex-shrink-0">{step.number}</div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/hakkimizda/hakkimizdagorsel2.webp"
                alt="Üretim süreci"
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
