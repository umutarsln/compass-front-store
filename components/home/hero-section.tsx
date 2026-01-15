"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative flex items-start justify-center pt-24 md:pt-28 pb-20 px-6 lg:px-8">
      {/* Mobil Container - Görselin tamamını göster */}
      <div className="relative w-full md:hidden">
        <div className="relative w-full rounded-lg overflow-hidden">
          {/* Mobil Görsel - Tamamı görünsün */}
          <div className="relative w-full">
            <Image
              src="/hero/herosection-mobil.png"
              alt="Anılarınızı Işığa Dönüştürün"
              width={1080}
              height={1920}
              className="w-full h-auto"
              priority
            />
            {/* Gradient Overlay - Mobilde daha hafif */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30" />

            {/* Mobil İçerik - Görselin üzerine overlay */}
            <div className="absolute inset-0 flex flex-col justify-end pt-12 pb-32 px-6 z-10">
              {/* Mobil Alt - Ana İçerik */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center px-2"
              >
                <h1 className="font-serif text-3xl sm:text-4xl text-white leading-tight text-balance">
                  Anılarınızı Işığa Dönüştürün
                </h1>

                <p className="mt-4 text-base text-white/90 max-w-lg mx-auto leading-relaxed">
                  Shawk ile fotoğraflarınızdan benzersiz, kişiselleştirilmiş 3D LED lambalar yaratıyoruz. Her lamba bir hikaye, her
                  ışık bir anı taşır. Sevdiklerinize unutulmaz hediyeler hazırlayın.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Container */}
      <div className="hidden md:block relative w-full max-w-[1280px] h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero/hero-section-image.jpeg"
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
                Shawk ile fotoğraflarınızdan benzersiz, kişiselleştirilmiş 3D LED lambalar yaratıyoruz. Her lamba bir hikaye, her
                ışık bir anı taşır. Sevdiklerinize unutulmaz hediyeler hazırlayın.
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
