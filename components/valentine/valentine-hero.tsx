"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

interface ValentineHeroProps {
  backgroundImage?: string
  mobileBackgroundImage?: string
}

export function ValentineHero({ 
  backgroundImage = "/romantic/sevgililer günü görsel 2.png",
  mobileBackgroundImage = "/romantic/sevgililergünüözel(mobil).png"
}: ValentineHeroProps) {
  return (
    <section className="relative flex items-start justify-center pt-12 md:pt-16 pb-20 px-6 lg:px-8">
      {/* Mobil Container - Görselin tamamını göster */}
      <div className="relative w-full md:hidden">
        <div className="relative w-full rounded-lg overflow-hidden">
          {/* Mobil Görsel - Tamamı görünsün */}
          <div className="relative w-full">
            <Image
              src={mobileBackgroundImage}
              alt="Sevgililer Günü"
              width={1080}
              height={1920}
              className="w-full h-auto"
              priority
            />
            {/* Gradient Overlay - Mobilde daha hafif */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30" />

            {/* Mobil İçerik - Görselin üzerine overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
            {/* Mobil Üst - İndirim/Tarih Bilgileri */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-row items-center justify-end gap-3 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20 self-end"
            >
              <div className="text-center">
                <div className="font-serif text-xl text-white">%20</div>
                <div className="text-xs text-white/80 mt-0.5">İndirim</div>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <div className="font-serif text-xl text-white">14 Şubat</div>
                <div className="text-xs text-white/80 mt-0.5">Son Sipariş</div>
              </div>
              <div className="w-px h-10 bg-white/30" />
              <div className="text-center">
                <div className="font-serif text-xl text-white">Ücretsiz</div>
                <div className="text-xs text-white/80 mt-0.5">Hediye Paketi</div>
              </div>
            </motion.div>

            {/* Mobil Alt - Ana İçerik */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center px-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/20 backdrop-blur-sm text-white mb-4 rounded-full">
                <Heart className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium uppercase tracking-wider">14 Şubat Özel</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl text-white leading-tight text-balance">
                Sevdiklerinize Unutulmaz Bir Hediye
              </h1>

              <p className="mt-4 text-sm text-white/90 leading-relaxed">
                Bu Sevgililer Günü, sevdiğinize en anlamlı hediyeyi verin. Birlikte çektiğiniz fotoğrafları benzersiz bir
                LED lambaya dönüştürün.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="#hediyeler"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-medium text-xs uppercase tracking-wider hover:bg-accent/90 transition-colors shadow-lg rounded"
                >
                  Hediyeleri Keşfet
                </Link>
                <Link
                  href="/kategoriler/sevgiliye-ozel"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors rounded"
                >
                  Tüm Ürünler
                </Link>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Container */}
      <div className="hidden md:block relative w-full max-w-[1280px] h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
        {/* Arka Plan Görseli */}
        <div className="absolute inset-0">
          {/* Desktop Görsel */}
          <Image
            src={backgroundImage}
            alt="Sevgililer Günü"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay - Soldan sağa doğru açılıyor, sol karanlık sağ aydınlık */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        </div>

        {/* Sağ Üst - İndirim/Tarih Bilgileri - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-6 right-12 lg:top-8 lg:right-16 flex flex-row items-center gap-4 lg:gap-6 z-10 bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg border border-white/20"
        >
          <div className="text-center">
            <div className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white">%20</div>
            <div className="text-xs sm:text-sm text-white/80 mt-1">İndirim</div>
          </div>
          <div className="w-px h-12 bg-white/30" />
          <div className="text-center">
            <div className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white">14 Şubat</div>
            <div className="text-xs sm:text-sm text-white/80 mt-1">Son Sipariş</div>
          </div>
          <div className="w-px h-12 bg-white/30" />
          <div className="text-center">
            <div className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white">Ücretsiz</div>
            <div className="text-xs sm:text-sm text-white/80 mt-1">Hediye Paketi</div>
          </div>
        </motion.div>

        {/* Sol Taraf - Ana İçerik - Desktop */}
        <div className="relative h-full flex items-center">
          <div className="px-8 lg:px-12 py-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-left max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm text-white mb-6 rounded-full">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium uppercase tracking-wider">14 Şubat Özel</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight text-balance">
                Sevdiklerinize Unutulmaz Bir Hediye
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed">
                Bu Sevgililer Günü, sevdiğinize en anlamlı hediyeyi verin. Birlikte çektiğiniz fotoğrafları benzersiz bir
                LED lambaya dönüştürün ve aşkınızı ışıkla ifade edin.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="#hediyeler"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent text-accent-foreground font-medium text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors shadow-lg"
                >
                  Hediyeleri Keşfet
                </Link>
                <Link
                  href="/kategoriler/sevgiliye-ozel"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-medium text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                  Tüm Ürünler
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
