"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram } from "lucide-react"

const instagramImages = [
  "/led-lamp-product-photo-aesthetic-minimalist.jpg",
  "/couple-holding-personalized-lamp-gift.jpg",
  "/bedroom-interior-with-glowing-led-lamp.jpg",
  "/unboxing-personalized-lamp-gift-moment.jpg",
  "/led-lamp-on-desk-home-office-decor.jpg",
  "/close-up-led-lamp-detail-craftsmanship.jpg",
]

export function InstagramSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl text-foreground">Instagram&apos;da Biz</h2>
          <p className="mt-4 text-muted-foreground">
            Müşterilerimizin paylaşımlarını ve yeni tasarımlarımızı keşfedin.
          </p>
          <a
            href="https://www.instagram.com/shawk.lamp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-accent hover:underline"
          >
            <Instagram className="w-4 h-4" />
            @isikanilar
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instagramImages.map((src, index) => (
            <motion.a
              key={index}
              href="https://www.instagram.com/shawk.lamp/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative aspect-square group overflow-hidden"
            >
              <Image
                src={src || "/placeholders/placeholder.svg"}
                alt={`Instagram gönderi ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
