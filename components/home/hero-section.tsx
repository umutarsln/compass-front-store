"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative flex items-start justify-center pt-24 md:pt-28 pb-20 px-6 lg:px-8">
      {/* Mobil Container - Arka plan görseli */}
      <div className="relative w-full md:hidden">
        <div className="relative w-full rounded-lg overflow-hidden">
          <Image
            src="/hero/heromobil-görsel.webp"
            alt="Anılarınızı Işığa Dönüştürün"
            width={1080}
            height={1920}
            className="w-full h-auto"
            priority
            sizes="100vw"
            quality={85}
          />
          {/* Gradient Overlay - Yazıların okunabilirliği için */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />

          {/* Mobil İçerik */}
          <div className="absolute inset-0 flex flex-col justify-between pt-12 pb-8 px-6 z-10">
            {/* Üst İçerik - Başlık ve Açıklama */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight text-balance mb-4">
                Anılarınızı Işığa Dönüştürün
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-lg mx-auto leading-relaxed">
                <b>Fotoğraflarınızdan hazırlanan</b> <br /> <b>kişiye özel lambalarla,</b>
                <br /> <b>en değerli anılarınızı sıcak bir ışıkla</b> <br /> <b>yeniden yaşayın.</b>
                <br /> <b>Her lamba size özel, her ışık bir anı taşır.</b>
              </p>
            </motion.div>
            
            {/* Alt İçerik - Butonlar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col gap-3 px-4"
            >
              <Link
                href="/urunler"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-medium text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Ürünleri Keşfet
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Desktop Container */}
      <div className="hidden md:block relative w-full max-w-[1280px] h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero/hero-section-image-pc.jpg"
            alt="Hero section background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Gradient Overlay - Sol tarafta karartma */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="px-8 lg:px-12 py-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight text-balance">
                Anılarınızı Işığa Dönüştürün
              </h1>
              <p className="mt-6 text-lg text-white/90 max-w-lg leading-relaxed">
              Fotoğraflarınızdan hazırlanan kişiye özel lambalarla,
              <br /> en değerli anılarınızı sıcak bir ışıkla yeniden yaşatın.
              <br /> Her lamba size özel, her ışık bir anı taşır.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/urunler"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium text-sm uppercase tracking-wider hover:bg-white/90 transition-colors"
                >
                  Ürünleri Keşfet
                </Link>
                <Link
                  href="/nasil-calisir"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                  Nasıl Çalışır?
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
