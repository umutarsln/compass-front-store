"use client"

import { motion } from "framer-motion"
import { Heart, Sparkles, Users, Leaf } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Anlam",
    description: "Her üründe derin bir anlam ve duygusal değer olmasına özen gösteriyoruz.",
  },
  {
    icon: Sparkles,
    title: "Kalite",
    description: "Premium malzemeler ve titiz el işçiliği ile uzun ömürlü ürünler sunuyoruz.",
  },
  {
    icon: Users,
    title: "Müşteri Odaklılık",
    description: "Her müşterimizin hikayesi bizim için özel. Kişiselleştirilmiş hizmet sunuyoruz.",
  },
  {
    icon: Leaf,
    title: "Sürdürülebilirlik",
    description: "Çevre dostu malzemeler ve enerji verimli LED teknolojisi kullanıyoruz.",
  },
]

export function AboutValues() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">Değerlerimiz</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">Bizi Biz Yapan Değerler</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary text-foreground mb-6">
                <value.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
