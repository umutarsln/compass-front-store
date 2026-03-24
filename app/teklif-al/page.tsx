"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Send, CheckCircle, ArrowLeft, Phone, Mail, Building2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"

/**
 * Teklif Al sayfası - Forge QuoteRequest UI
 * Store useCart ve useToast kullanılıyor
 */
export default function TeklifAlPage() {
  const { items, getTotalItems } = useCart()
  const { toast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  })

  const totalItems = getTotalItems()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validate = () => {
    const trimmed = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    }
    if (!trimmed.name || trimmed.name.length > 100) return "Lütfen geçerli bir ad girin."
    if (!trimmed.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) return "Lütfen geçerli bir e-posta girin."
    if (!trimmed.phone || trimmed.phone.length < 10 || trimmed.phone.length > 20)
      return "Lütfen geçerli bir telefon numarası girin."
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      toast({ title: "Hata", description: error, variant: "destructive" })
      return
    }
    setSubmitted(true)
    toast({ title: "Teklif talebiniz alındı!", description: "En kısa sürede size dönüş yapacağız." })
  }

  if (submitted) {
    return (
      <>
        <main className="min-h-[60vh] flex flex-col items-center justify-center py-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">Talebiniz Alındı!</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Teklif talebiniz başarıyla iletildi. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button>Ana Sayfaya Dön</Button>
              </Link>
              <Link href="/urunler">
                <Button variant="outline">Ürünlere Göz At</Button>
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen py-8">
        <div className="container max-w-4xl">
          <Link
            href="/sepet"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-3 w-3" /> Sepete Dön
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Teklif Al</h1>
          <p className="text-muted-foreground mb-10">Bilgilerinizi doldurun, size en uygun teklifi hazırlayalım.</p>

          <div className="grid md:grid-cols-5 gap-10">
            <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Ad Soyad *</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Firma Adı</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="Firma adınız"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">E-posta *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      maxLength={255}
                      placeholder="ornek@firma.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Telefon *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={20}
                      placeholder="+90 5XX XXX XX XX"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Mesajınız</label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  maxLength={1000}
                  placeholder="Özel gereksinimleriniz, adet bilgisi veya sorularınız..."
                  rows={4}
                />
              </div>
              <Button type="submit" size="lg" className="w-full gap-2">
                <Send className="h-4 w-4" /> Teklif Talebini Gönder
              </Button>
            </form>

            <div className="md:col-span-2">
              <div className="bg-muted rounded-lg p-5 sticky top-24">
                <h3 className="font-display font-semibold text-foreground mb-4">Seçilen Ürünler ({totalItems})</h3>
                {items.length > 0 ? (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={item.image || "/placeholders/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Adet: {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Sepetinizde ürün yok. Formu ürünsüz de gönderebilirsiniz.</p>
                )}
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href="tel:+905519770858" className="hover:text-primary transition-colors">
                      0551 977 08 58
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href="mailto:emredgli07@gmail.com" className="hover:text-primary transition-colors">
                      emredgli07@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
