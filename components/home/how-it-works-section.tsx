"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const steps = [
  {
    title: "Fotoğrafını Yükle",
    description: "Lambanızda görmek istediğiniz fotoğrafı seçin ve yükleyin.",
    image: "/nasil-calisir/nasılcalisir1.png",
  },
  {
    title: "Tasarımı Onayla",
    description: "Fotoğrafın, lambaya en iyi şekilde uyarlanır. Hazırlanan tasarımı incele, onayla ve üretime geçelim.",
    image: "/nasil-calisir/nasilcalisir2.png",
  },
  {
    title: "Kapına Gelsin",
    description: "Özel üretim lambanız güvenle paketlenir ve adresinize gönderilir. Anılarınızı sıcak bir ışıkla yeniden yaşayın.",
    image: "/nasil-calisir/nasilcalisir3.png",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">Nasıl Çalışır?</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Sadece üç adımda hayalinizdeki lambaya sahip olun.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative mb-6 rounded-lg overflow-hidden bg-background aspect-[4/3]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">Adım {index + 1}</div>
              <h3 className="font-serif text-xl lg:text-2xl text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
