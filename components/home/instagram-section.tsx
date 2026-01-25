"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram } from "lucide-react"

const instagramImages = [
  "/instagram-post/post1-kareend.webp",
  "/instagram-post/post1-silindir-end.webp",
  "/instagram-post/post2-1.webp",
  "/instagram-post/post2-2.webp",
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
            @shawk.lamp
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
              className={`relative w-full group overflow-hidden flex items-center justify-center bg-secondary ${
                index < 2 ? "aspect-[4/5]" : ""
              }`}
            >
              <Image
                src={src || "/placeholders/placeholder.svg"}
                alt={`Instagram gönderi ${index + 1}`}
                width={1000}
                height={1000}
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`transition-transform duration-300 group-hover:scale-105 ${
                  index < 2 ? "w-full h-full object-cover" : "w-full h-auto object-contain"
                }`}
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <Instagram className="w-6 h-6 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
