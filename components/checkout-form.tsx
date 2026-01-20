"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Lock, Truck, ChevronLeft, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { orderService, CreateOrderDto, Address } from "@/services/order.service"
import { paymentService, PaymentProvider } from "@/services/payment.service"
import { getCartId } from "@/lib/cart-storage"
import { cartService } from "@/services/cart.service"
import { useToast } from "@/hooks/use-toast"

export function CheckoutForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, getTotalPrice, getTotalItems, getCartId: getCartIdFromContext, syncCart, isLoading: cartLoading } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // İletişim bilgileri
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    // Adres bilgileri
    address: "",
    city: "",
    district: "",
    postalCode: "",
    country: "TR",
    // Billing address (opsiyonel)
    useBillingAddress: false,
    billingAddress: "",
    billingCity: "",
    billingDistrict: "",
    billingPostalCode: "",
    billingCountry: "TR",
    billingTaxNumber: "",
    billingTaxOffice: "",
    // Notlar
    notes: "",
  })

  // Sepet boşsa sepet sayfasına yönlendir
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push("/sepet")
    }
  }, [cartLoading, items.length, router])

  // Giriş yapılmışsa user bilgilerini doldur
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        phone: user.phone || "",
      }))
    }
  }, [isAuthenticated, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const validateStep1 = (): boolean => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm iletişim bilgilerini doldurun.",
        variant: "destructive",
      })
      return false
    }
    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Geçersiz Email",
        description: "Lütfen geçerli bir email adresi girin.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const validateStep2 = (): boolean => {
    if (!formData.address || !formData.city || !formData.district || !formData.postalCode) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm adres bilgilerini doldurun.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleStep1Next = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleStep2Next = () => {
    if (validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Sync cart first to ensure cart ID is up to date
      try {
        await syncCart()
      } catch (error) {
        console.error("Failed to sync cart:", error)
      }

      // Get cart ID - try from context first, then localStorage, then user cart if authenticated
      let cartId = getCartIdFromContext() || getCartId()

      if (!cartId && isAuthenticated) {
        // If no cart ID, try to get user cart
        try {
          const userCart = await cartService.getUserCart()
          if (userCart) {
            cartId = userCart.id
            // Save to localStorage for next time
            if (typeof window !== 'undefined') {
              localStorage.setItem('shawk_cart_id', userCart.id)
            }
          }
        } catch (error) {
          console.error("Failed to get user cart:", error)
        }
      }

      if (!cartId) {
        toast({
          title: "Sepet Bulunamadı",
          description: "Sepetiniz bulunamadı. Lütfen sepet sayfasına dönün ve tekrar deneyin.",
          variant: "destructive",
        })
        router.push("/sepet")
        setIsSubmitting(false)
        return
      }

      // Shipping address oluştur
      const shippingAddress: Address = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        postalCode: formData.postalCode,
        country: formData.country,
      }

      // Billing address oluştur (varsa)
      let billingAddress
      if (formData.useBillingAddress) {
        billingAddress = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.billingAddress,
          city: formData.billingCity,
          district: formData.billingDistrict,
          postalCode: formData.billingPostalCode,
          country: formData.billingCountry,
          taxNumber: formData.billingTaxNumber || undefined,
          taxOffice: formData.billingTaxOffice || undefined,
        }
      }

      // Order oluştur
      const createOrderDto: CreateOrderDto = {
        cartId,
        shippingAddress,
        billingAddress,
        shippingCost: 0, // Ücretsiz kargo
        discount: 0,
        notes: formData.notes || undefined,
      }

      // Guest checkout için bilgiler
      if (!isAuthenticated) {
        createOrderDto.guestEmail = formData.email
        createOrderDto.guestPhone = formData.phone
        createOrderDto.guestFirstName = formData.firstName
        createOrderDto.guestLastName = formData.lastName
      }

      const order = await orderService.createOrder(createOrderDto)

      console.log('Order created:', order)

      // Payment checkout başlat
      const checkoutResponse = await paymentService.createCheckout({
        orderId: order.id,
        provider: PaymentProvider.IYZICO,
      })

      console.log('Checkout response:', checkoutResponse)

      // Iyzico payment sayfasına yönlendir
      if (!checkoutResponse.redirectUrl) {
        throw new Error("Ödeme sayfası URL'i alınamadı. Lütfen tekrar deneyin.")
      }

      console.log('Redirecting to Iyzico payment page:', checkoutResponse.redirectUrl)

      // Iyzico ödeme sayfasına yönlendir
      window.location.href = checkoutResponse.redirectUrl
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "Ödeme Hatası",
        description: error?.response?.data?.message || error?.message || "Ödeme işlemi başlatılamadı. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (cartLoading || items.length === 0) {
    return (
      <section className="py-12 bg-background min-h-screen">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = 0
  const total = subtotal + shipping

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/sepet"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Sepete Dön
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-2">Güvenli Ödeme</h1>
          <p className="text-muted-foreground mb-8">Siparişinizi tamamlamak için bilgilerinizi girin.</p>

          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${step >= s ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
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
                      E-posta Adresi <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      readOnly={isAuthenticated}
                      className={`w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors ${isAuthenticated ? "bg-secondary cursor-not-allowed" : ""
                        }`}
                      placeholder="ornek@email.com"
                      required
                    />
                    {isAuthenticated && (
                      <p className="text-xs text-muted-foreground mt-1">Giriş yaptığınız için email düzenlenemez.</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                        Ad <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="Adınız"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                        Soyad <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="Soyadınız"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Telefon Numarası <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="05XX XXX XX XX"
                      required
                    />
                  </div>

                  <button
                    onClick={handleStep1Next}
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
                      Adres <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="Sokak, Mahalle, Bina No"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                        İl <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="İl"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-foreground mb-2">
                        İlçe <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                        placeholder="İlçe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-foreground mb-2">
                      Posta Kodu <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                      placeholder="34000"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="useBillingAddress"
                      name="useBillingAddress"
                      checked={formData.useBillingAddress}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4"
                    />
                    <label htmlFor="useBillingAddress" className="text-sm text-foreground">
                      Fatura adresi teslimat adresinden farklı
                    </label>
                  </div>

                  {formData.useBillingAddress && (
                    <div className="space-y-4 p-4 border border-border bg-secondary">
                      <h3 className="font-medium text-foreground">Fatura Adresi</h3>
                      <div>
                        <label htmlFor="billingAddress" className="block text-sm font-medium text-foreground mb-2">
                          Adres
                        </label>
                        <input
                          type="text"
                          id="billingAddress"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                          placeholder="Sokak, Mahalle, Bina No"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="billingCity" className="block text-sm font-medium text-foreground mb-2">
                            İl
                          </label>
                          <input
                            type="text"
                            id="billingCity"
                            name="billingCity"
                            value={formData.billingCity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                            placeholder="İl"
                          />
                        </div>
                        <div>
                          <label htmlFor="billingDistrict" className="block text-sm font-medium text-foreground mb-2">
                            İlçe
                          </label>
                          <input
                            type="text"
                            id="billingDistrict"
                            name="billingDistrict"
                            value={formData.billingDistrict}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                            placeholder="İlçe"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="billingPostalCode" className="block text-sm font-medium text-foreground mb-2">
                          Posta Kodu
                        </label>
                        <input
                          type="text"
                          id="billingPostalCode"
                          name="billingPostalCode"
                          value={formData.billingPostalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                          placeholder="34000"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="billingTaxNumber" className="block text-sm font-medium text-foreground mb-2">
                            Vergi Numarası
                          </label>
                          <input
                            type="text"
                            id="billingTaxNumber"
                            name="billingTaxNumber"
                            value={formData.billingTaxNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                            placeholder="Vergi Numarası"
                          />
                        </div>
                        <div>
                          <label htmlFor="billingTaxOffice" className="block text-sm font-medium text-foreground mb-2">
                            Vergi Dairesi
                          </label>
                          <input
                            type="text"
                            id="billingTaxOffice"
                            name="billingTaxOffice"
                            value={formData.billingTaxOffice}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors"
                            placeholder="Vergi Dairesi"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                      Sipariş Notları (Opsiyonel)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-border focus:border-foreground focus:outline-none transition-colors resize-none"
                      placeholder="Siparişinizle ilgili özel notlarınız varsa buraya yazabilirsiniz..."
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
                      onClick={handleStep2Next}
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
                  <h2 className="font-serif text-xl text-foreground mb-6">Ödeme</h2>

                  <div className="p-6 border border-border bg-secondary">
                    <p className="text-sm text-foreground mb-4">
                      Ödeme işlemi Iyzico güvenli ödeme sistemi üzerinden gerçekleştirilecektir.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      "Ödeme Yap" butonuna tıkladığınızda Iyzico ödeme sayfasına yönlendirileceksiniz.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-secondary">
                    <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Kart bilgileriniz sunucularımızda
                      saklanmaz.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                      disabled={isSubmitting}
                    >
                      Geri
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          İşleniyor...
                        </>
                      ) : (
                        "Ödeme Yap"
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 sticky top-28">
                <h3 className="font-serif text-lg text-foreground mb-6">Sipariş Özeti</h3>

                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || 'simple'}`} className="flex gap-4 pb-6 border-b border-border mb-6">
                    <div className="relative w-20 h-20 bg-background shrink-0">
                      <Image
                        src={item.image || "/placeholders/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                      {item.variantValues && item.variantValues.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.variantValues.map((vv) => vv.value).join(" / ")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">Adet: {item.quantity}</p>
                      <p className="text-sm font-medium text-foreground mt-2">
                        {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                      </p>
                    </div>
                  </div>
                ))}

                <div className="space-y-3 py-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="text-foreground">{subtotal.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="text-accent">Ücretsiz</span>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <span className="font-medium text-foreground">Toplam</span>
                  <span className="font-serif text-xl text-foreground">{total.toLocaleString("tr-TR")} ₺</span>
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
