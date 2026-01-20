"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: "kisiye-ozel-tasarimlar",
    title: "Kişiye Özel Tasarımlar",
    image: "/campaigns/Kişiye Özel Tasarımlar -c -kare-.jpg",
    href: "/urunler?categorySlugs=kiiye-zel-tasarmlar%2Cak-sevgiliye-zel%2Caile-annebabaya-zel%2Ckurumsal-baar-ofis%2Cdoum-gn-kutlama&orderBy=created_at_desc",
    colSpan: 2, // 2 sütun
    rowSpan: 2, // 2 satır
  },
  {
    id: "hazir-tasarim-koleksiyonlari",
    title: "Hazır Tasarım Koleksiyonları",
    image: "/campaigns/Hazır Tasarım Koleksiyonları -c -yatay-.jpg",
    href: "/urunler?categorySlugs=hazr-tasarmlar%2Cmzik-temal-tasarmlar%2Cspor-temal-tasarmlar%2Cpopler-kltr-anime-dizi-film%2Cminimalist-sanat&orderBy=created_at_desc",
    colSpan: 2, // 2 sütun
    rowSpan: 1, // 1 satır
  },
  {
    id: "yaklasan-ozel-gun",
    title: "Yaklaşan Özel Gün",
    image: "/gifts/special-occasion-celebration-led-lamp-gift.jpg",
    href: "/urunler",
    colSpan: 1, // 1 sütun
    rowSpan: 1, // 1 satır
  },
  {
    id: "en-cok-satanlar",
    title: "En Çok Satanlar",
    image: "/products/sports-team-logo-led-lamp-decorative-lighting.jpg",
    href: "/urunler",
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
          Her kategori, farklı bir anıya ışık tutmak için tasarlandı.
          </p>
        </motion.div>

        {/* Mobil Görünüm */}
        <div className="md:hidden space-y-4">
          {/* Kişiye Özel Tasarımlar - Tek satır, tek kategori */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href={categories[0].href} className="group block">
              <div className="relative w-full aspect-square overflow-hidden bg-secondary p-5">
                <Image
                  src={categories[0].image || "/placeholders/placeholder.svg"}
                  alt={categories[0].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
                  <h3 className="text-sm font-medium text-white text-center uppercase tracking-wider">
                    {categories[0].title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Hazır Tasarım Koleksiyonları - Tek satır, tek kategori */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href={categories[1].href} className="group block">
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary p-5">
                <Image
                  src={categories[1].image || "/placeholders/placeholder.svg"}
                  alt={categories[1].title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
                  <h3 className="text-sm font-medium text-white text-center uppercase tracking-wider">
                    {categories[1].title}
                  </h3>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Yaklaşan Özel Gün ve En Çok Satanlar - 1 satır, 2 kategori */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href={categories[2].href} className="group block">
                <div className="relative w-full aspect-square overflow-hidden bg-secondary p-5">
                  <Image
                    src={categories[2].image || "/placeholders/placeholder.svg"}
                    alt={categories[2].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
                    <h3 className="text-xs font-medium text-white text-center uppercase tracking-wider">
                      {categories[2].title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href={categories[3].href} className="group block">
                <div className="relative w-full aspect-square overflow-hidden bg-secondary p-5">
                  <Image
                    src={categories[3].image || "/placeholders/placeholder.svg"}
                    alt={categories[3].title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
                    <h3 className="text-xs font-medium text-white text-center uppercase tracking-wider">
                      {categories[3].title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Desktop Görünüm */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-[20px] w-full aspect-[2/1]">
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
