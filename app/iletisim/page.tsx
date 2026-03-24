"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const contactInfo = [
  { icon: Phone, label: "Telefon", value: "0551 977 08 58", href: "tel:+905519770858" },
  { icon: Mail, label: "E-posta", value: "emredgli07@gmail.com", href: "mailto:emredgli07@gmail.com" },
  { icon: MapPin, label: "Adres", value: "Yenidoğan Mah. 3079 sokak no:13, Kepez / Antalya" },
  { icon: Clock, label: "Çalışma Saatleri", value: "Her gün 7/24 açık" },
]

/**
 * İletişim sayfası - Forge Contact UI
 * Form state ve submit handler korunuyor
 */
export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Backend entegrasyonu
    toast({ title: "Mesajınız gönderildi!", description: "En kısa sürede size dönüş yapacağız." })
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <>
      <main>
        {/* Hero */}
        <section className="bg-secondary py-20">
          <div className="container text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-primary font-semibold text-sm uppercase tracking-wider"
            >
              İletişim
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-secondary-foreground mt-3 mb-4"
            >
              Bize Ulaşın
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground max-w-2xl mx-auto text-lg"
            >
              Sorularınız, teklif talepleriniz veya teknik destek için bizimle iletişime geçin.
            </motion.p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 -mt-8">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-lg p-5 border border-border shadow-card text-center"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1">{item.label}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form + Map */}
        <section className="py-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">İletişim Formu</h2>
                <p className="text-muted-foreground text-sm mb-8">Formu doldurun, size en kısa sürede dönüş yapalım.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Ad Soyad"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      placeholder="E-posta"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Telefon"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <Textarea
                    placeholder="Mesajınız..."
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <Button variant="default" size="lg" type="submit" className="w-full sm:w-auto">
                    <Send className="mr-2 h-4 w-4" /> Gönder
                  </Button>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-lg overflow-hidden border border-border shadow-card"
              >
                <iframe
                  title="Konum"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3182.5!2d30.7!3d36.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDU0JzAwLjAiTiAzMMKwNDInMDAuMCJF!5e0!3m2!1str!2str!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 400 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
