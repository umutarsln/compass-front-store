"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, Tag } from "lucide-react"

const promotions = [
  {
    id: 1,
    text: "3000 TL üstüne kargo bedava",
    icon: Truck,
  },
  {
    id: 2,
    text: "Tüm ürünlerde %20 indirim",
    icon: Tag,
  },
]

export function Topbar() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promotions.length)
    }, 4000) // 4 saniyede bir değiş

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[50] bg-primary text-primary-foreground border-b border-primary/20 pt-0.5 pb-0.5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-center justify-center h-6 md:h-7">
          <AnimatePresence mode="wait">
            {promotions.map((promo, index) => {
              if (index !== currentIndex) return null
              const Icon = promo.icon
              return (
                <motion.div
                  key={promo.id}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  <span className="text-[10px] md:text-xs font-medium tracking-wide">
                    {promo.text}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
