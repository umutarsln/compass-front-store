"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Shield, Lock, CreditCard, Truck, ChevronLeft } from "lucide-react"

const orderSummary = {
  items: [
    {
      id: "sevgili-silüet-lamba",
      name: "Sevgili Silüet Lamba",
      color: "Sıcak Beyaz",
      size: "Orta (20cm)",
      price: 349,
      quantity: 1,
      image: "/romantic-couple-heart-shaped-led-lamp-warm-glow.jpg",
    },
  ],
  subtotal: 349,
  shipping: 0,
  total: 349,
}

export function CheckoutForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postalCode: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Alışverişe Devam Et
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-2">Güvenli Ödeme</h1>
          <p className="text-muted-foreground mb-8">Siparişinizi tamamlamak için bilgilerinizi girin.</p>

          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
                    step >= s ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                <span className={`text-sm hidden sm:inline ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "İletişim" : s === 2 ? "Adres" : "Ödeme"}
                </span>
                {s < 3 && <div className="w-8 sm:w-16 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-xl text-foreground mb-6">İletişim Bilgileri</h2>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      E-posta Adresi
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                        Ad
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="Adınız"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                        Soyad
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefon Numarası
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    Devam Et
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-xl text-foreground mb-6">Teslimat Adresi</h2>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
                      Adres
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="Sokak, Mahalle, Bina No"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                        İl
                      </label>
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      >
                        <option value="">Seçiniz</option>
                        <option value="istanbul">İstanbul</option>
                        <option value="ankara">Ankara</option>
                        <option value="izmir">İzmir</option>
                        <option value="bursa">Bursa</option>
                        <option value="antalya">Antalya</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-foreground mb-2">
                        İlçe
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="İlçe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-2">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="34000"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                    >
                      Geri
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                    >
                      Devam Et
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h2 className="font-serif text-xl text-foreground mb-6">Ödeme Bilgileri</h2>

                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">
                      Kart Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors pr-12"
                        placeholder="XXXX XXXX XXXX XXXX"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-foreground mb-2">
                      Kart Üzerindeki İsim
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="AD SOYAD"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-foreground mb-2">
                        Son Kullanma
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="AA/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="XXX"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-secondary">
                    <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz sunucularımızda
                      saklanmaz.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                    >
                      Geri
                    </button>
                    <button className="flex-1 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                      Siparişi Tamamla
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 sticky top-28">
                <h3 className="font-serif text-lg text-foreground mb-6">Sipariş Özeti</h3>

                {orderSummary.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-border">
                    <div className="relative w-20 h-20 bg-background flex-shrink-0">
                      <Image src={item.image || "/placeholders/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm font-medium text-foreground mt-2">{item.price.toLocaleString("tr-TR")} ₺</p>
                    </div>
                  </div>
                ))}

                <div className="space-y-3 py-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="text-foreground">{orderSummary.subtotal.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="text-accent">Ücretsiz</span>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <span className="font-medium text-foreground">Toplam</span>
                  <span className="font-serif text-xl text-foreground">
                    {orderSummary.total.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="w-4 h-4" />
                    <span>Ücretsiz Kargo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
