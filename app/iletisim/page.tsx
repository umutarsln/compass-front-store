"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, Send, Instagram } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // TODO: Backend entegrasyonu
    alert("Mesajınız alındı! En kısa sürede size dönüş yapacağız.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        {/* Hero Section */}
        <section className="relative py-12 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">İletişim</p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Bizimle İletişime Geçin
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sorularınız, önerileriniz veya özel talepleriniz için bize ulaşabilirsiniz. Size en kısa sürede dönüş yapacağız.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="pt-12 pb-24 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-6">Mesaj Gönderin</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Ad Soyad <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      E-posta Adresi <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefon
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XX XXX XX XX"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Mesajınız <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    <Send className="w-4 h-4" />
                    Mesaj Gönder
                  </Button>
                </form>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-6">İletişim Bilgileri</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">E-posta</h3>
                      <div className="space-y-1">
                        <a href="mailto:emredgli07@gmail.com" className="block text-muted-foreground hover:text-foreground transition-colors">
                          emredgli07@gmail.com
                        </a>
                        <a href="mailto:durmusikartci@gmail.com" className="block text-muted-foreground hover:text-foreground transition-colors">
                          durmusikartci@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">Telefon</h3>
                      <div className="space-y-1">
                        <a href="tel:+905519770858" className="block text-muted-foreground hover:text-foreground transition-colors">
                          0551 977 08 58 - Hüseyin Emre Dağlı
                        </a>
                        <a href="tel:+905441049510" className="block text-muted-foreground hover:text-foreground transition-colors">
                          0544 104 95 10 - Durmuş Kartcı
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">Adres</h3>
                      <p className="text-muted-foreground">
                        Yenidoğan Mahallesi 3079 sokak no:13<br />
                        KEPEZ / Antalya 00700<br />
                        Türkiye
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-md flex items-center justify-center">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-1">Çalışma Saatleri</h3>
                      <p className="text-muted-foreground">
                        Her gün 7/24 açık
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-secondary rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">Sosyal Medya</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Bizi sosyal medyada takip edin ve özel kampanyalardan haberdar olun.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.instagram.com/shawk.lamp/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-md"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    {/* <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-md"
                      aria-label="TikTok"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </a> */}
                    <a
                      href="https://wa.me/905519770858"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded-md"
                      aria-label="WhatsApp"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
