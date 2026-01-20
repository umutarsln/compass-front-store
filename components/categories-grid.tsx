"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/products"

export function CategoriesGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground">Kategoriler</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Her kategori, farklı bir anıya ışık tutmak için tasarlandı.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/kategoriler/${category.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                  <Image
                    src={category.image || "/placeholders/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h2 className="font-serif text-2xl lg:text-3xl text-background">{category.name}</h2>
                    <p className="mt-2 text-sm text-background/80 max-w-xs">{category.description}</p>
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
