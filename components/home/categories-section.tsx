"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "kisiye-ozel-tasarimlar",
    title: "Kişiye Özel Tasarımlar",
    image: "/campaigns/KENDİ LAMBANI TASARLA -c (kare) kopyası.png",
    href: "/kategoriler/kisiye-ozel-tasarimlar",
    colSpan: 2, // 2 sütun
    rowSpan: 2, // 2 satır
  },
  {
    id: "hazir-tasarim-koleksiyonlari",
    title: "Hazır Tasarım Koleksiyonları",
    image: "/campaigns/hazır tasarım koleksiyonları (yatay).png",
    href: "/kategoriler/hazir-tasarim-koleksiyonlari",
    colSpan: 2, // 2 sütun
    rowSpan: 1, // 1 satır
  },
  {
    id: "yaklasan-ozel-gun",
    title: "Yaklaşan Özel Gün",
    image: "/gifts/special-occasion-celebration-led-lamp-gift.jpg",
    href: "/kategoriler/yaklasan-ozel-gun",
    colSpan: 1, // 1 sütun
    rowSpan: 1, // 1 satır
  },
  {
    id: "en-cok-satanlar",
    title: "En Çok Satanlar",
    image: "/products/sports-team-logo-led-lamp-decorative-lighting.jpg",
    href: "/kategoriler/en-cok-satanlar",
    colSpan: 1, // 1 sütun
    rowSpan: 1, // 1 satır
  },
]

export function CategoriesSection() {
  return (
    <section className="pt-24 pb-12 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">Kategoriler</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Her an için özel tasarımlar. Sevdiklerinize en anlamlı hediyeyi bulun.
          </p>
        </motion.div>

        <div className="grid grid-cols-4 grid-rows-2 gap-[20px] w-full aspect-[2/1]">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                gridColumn: `span ${category.colSpan}`,
                gridRow: `span ${category.rowSpan}`,
              }}
            >
              <Link href={category.href} className="group block h-full">
                <div className="relative w-full h-full overflow-hidden bg-secondary p-[20px]">
                  <Image
                    src={category.image || "/placeholders/placeholder.svg"}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 z-10">
                    <h3 className="text-sm font-medium text-white text-center uppercase tracking-wider">
                      {category.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
