"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const teamMembers = [
  {
    name: "Durmuş Kartcı",
    image: "/placeholders/placeholder.svg", // Görsel eklenecek
    description: "Shawk'ın kurucusu olarak, her ürünün bir hikaye taşıdığına inanıyorum. Fotoğraflarınızdan özel lambalar üretirken, her detayın mükemmel olması için çalışıyoruz. Müşterilerimizin anılarını ışığa dönüştürmek benim için sadece bir iş değil, bir tutku."
  },
  {
    name: "Hüseyin Emre Dağlı",
    image: "/placeholders/placeholder.svg", // Görsel eklenecek
    description: "Teknoloji ve tasarımın birleştiği noktada, her ürünün kalitesinden sorumluyum. LED teknolojisi ve akrilik işçiliğinde sürekli kendimizi geliştiriyor, müşterilerimize en iyi deneyimi sunmak için çalışıyoruz. Her lamba, bizim için bir sanat eseri."
  },
  {
    name: "Muhammed Fatih Kartcı",
    image: "/placeholders/placeholder.svg", // Görsel eklenecek
    description: "Üretim sürecinin her aşamasında yer alarak, her siparişin özenle hazırlanmasını sağlıyorum. Paketlemeden teslimata kadar tüm süreçlerde müşteri memnuniyetini ön planda tutuyoruz. Her ürün, sevdiklerinize verdiğiniz değerin bir yansıması olmalı."
  }
]

export function AboutTeam() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">Ekibimiz</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight text-balance">
            Ekip Üyelerimiz
          </h2>
        </motion.div>

        <div className="space-y-24">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Görsel - Solda (veya çift sayılı üyelerde sağda) */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative aspect-square max-w-md mx-auto lg:mx-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* İçerik - Sağda (veya çift sayılı üyelerde solda) */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <h3 className="font-serif text-2xl sm:text-3xl text-foreground mb-4">
                  {member.name}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
