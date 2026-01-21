"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const images = [
  {
    src: "/hergeceozelbirani/hergeceozelbirani1.png",
    alt: "Her gece özel bir anı",
  },
  {
    src: "/hergeceozelbirani/hergeceozelbirani2.png",
    alt: "Her gece özel bir anı",
  },
  {
    src: "/hergeceozelbirani/hergeceozelbirani3.png",
    alt: "Her gece özel bir anı",
  },
]

export function LifestyleSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
              Her Gece Özel Bir Anı Yaşayın
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Lambanız sadece bir ışık kaynağı değil, sevdiklerinizle paylaştığınız anıların sürekli bir hatırlatıcısı.
              Odanıza sıcaklık katar, kalbinize mutluluk.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-6">
              <div>
                <div className="font-serif text-4xl text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground mt-1">Mutlu Müşteri</div>
              </div>
              <div>
                <div className="font-serif text-4xl text-foreground">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Farklı Tasarım</div>
              </div>
              <div>
                <div className="font-serif text-4xl text-foreground">4.9</div>
                <div className="text-sm text-muted-foreground mt-1">Müşteri Puanı</div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {/* Yatay görsel - Üstte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-full aspect-[16/9] relative rounded-lg overflow-hidden"
            >
              <Image 
                src={images[0].src || "/placeholders/placeholder.svg"} 
                alt={images[0].alt} 
                fill 
                className="object-cover" 
              />
            </motion.div>
            {/* Kare görseller - Altta yan yana */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="aspect-square relative rounded-lg overflow-hidden"
              >
                <Image 
                  src={images[1].src || "/placeholders/placeholder.svg"} 
                  alt={images[1].alt} 
                  fill 
                  className="object-cover" 
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="aspect-square relative rounded-lg overflow-hidden"
              >
                <Image 
                  src={images[2].src || "/placeholders/placeholder.svg"} 
                  alt={images[2].alt} 
                  fill 
                  className="object-cover" 
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
