"use client"

import { motion } from "framer-motion"
import { Upload, Palette, Package } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Fotoğrafınızı Yükleyin",
    description: "Lambanızda görmek istediğiniz fotoğrafı seçin ve yükleyin.",
  },
  {
    icon: Palette,
    title: "Tasarımı Onaylayın",
    description: "Ekibimiz fotoğrafınızı 3D tasarıma dönüştürür, siz onaylarsınız.",
  },
  {
    icon: Package,
    title: "Kapınıza Gelsin",
    description: "Özel üretim lambanız güvenle paketlenir ve adresinize gönderilir.",
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

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-background text-foreground mb-6">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">Adım {index + 1}</div>
              <h3 className="font-serif text-xl text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
