"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

const valentineProducts = [
  {
    id: "sevgili-silüet-lamba",
    name: "Sevgili Silüet Lamba",
    originalPrice: 349,
    salePrice: 279,
    image: "/romantic-couple-heart-shaped-led-lamp-warm-glow.jpg",
    badge: "En Çok Satan",
  },
  {
    id: "kalp-fotograf-lamba",
    name: "Kalp Fotoğraf Lamba",
    originalPrice: 399,
    salePrice: 319,
    image: "/couple-holding-personalized-lamp-gift.jpg",
    badge: "Yeni",
  },
  {
    id: "yildonumu-lamba",
    name: "Yıldönümü Anı Lamba",
    originalPrice: 429,
    salePrice: 349,
    image: "/couple-looking-at-personalized-led-lamp-gift-unwra.jpg",
    badge: "Romantik",
  },
]

export function ValentineProducts() {
  return (
    <section id="hediyeler" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">Sevgililer Günü Koleksiyonu</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Aşkınızı ışıkla ifade edecek özel tasarımlar. Tüm ürünlerde %20 indirim.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {valentineProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href="/urun-detay" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <Image
                    src={product.image || "/placeholders/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1 text-xs font-medium">
                    <Heart className="w-3 h-3 fill-current" />
                    {product.badge}
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(255,150,150,0.2)]" />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="text-lg font-medium text-accent">{product.salePrice} ₺</span>
                    <span className="text-sm text-muted-foreground line-through">{product.originalPrice} ₺</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
          >
            Tüm Koleksiyonu Gör
          </Link>
        </div>
      </div>
    </section>
  )
}
