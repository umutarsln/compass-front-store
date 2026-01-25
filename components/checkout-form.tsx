"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Lock, Truck, ChevronLeft, Loader2, CreditCard, Building2, MessageCircle, Copy, Check, User, MapPin, FileText, Upload, Send, CheckCircle } from "lucide-react"
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
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1])) // İlk adım her zaman ziyaret edilmiş
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'iban-eft' | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Adım değiştiğinde ziyaret edilen adımları güncelle
  const handleStepChange = (newStep: number) => {
    setStep(newStep)
    setVisitedSteps(prev => new Set([...prev, newStep]))
  }
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null)

  // Kupon kodları - Backend'den gelecek (şimdilik test için)
  const validCoupons: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
    'KUPON10': { discount: 10, type: 'percentage' }
  }

  // Sayfa yüklendiğinde localStorage'dan kupon bilgisini oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCoupon = localStorage.getItem('shawk_applied_coupon')
      if (savedCoupon) {
        try {
          const couponData = JSON.parse(savedCoupon)
          if (validCoupons[couponData.code]) {
            setAppliedCoupon(couponData)
          }
        } catch (e) {
          localStorage.removeItem('shawk_applied_coupon')
        }
      }
    }
  }, [])

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
    // IBAN bilgileri
    iban: "",
    bankName: "",
    accountHolderName: "",
  })

  // Sepet boşsa sepet sayfasına yönlendir
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      // router.push("/sepet")
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

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => {
        setCopiedField(null)
      }, 2000)
    } catch (err) {
      console.error('Kopyalama hatası:', err)
      toast({
        title: "Hata",
        description: "Kopyalama işlemi başarısız oldu.",
        variant: "destructive",
      })
    }
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
      handleStepChange(2)
    }
  }

  const handleStep2Next = () => {
    if (validateStep2()) {
      setPaymentMethod('iban-eft') // IBAN seçeneğini varsayılan olarak seç
      handleStepChange(3)
    }
  }

  const handleSubmit = async () => {
    console.log('[CHECKOUT] handleSubmit başladı')
    console.log('[CHECKOUT] Form data:', formData)
    console.log('[CHECKOUT] Is authenticated:', isAuthenticated)
    console.log('[CHECKOUT] Payment method:', paymentMethod)

    // Payment method kontrolü
    if (!paymentMethod) {
      toast({
        title: "Ödeme Yöntemi Seçin",
        description: "Lütfen bir ödeme yöntemi seçin.",
        variant: "destructive",
      })
      return
    }

    // Kredi kartı şu an devre dışı
    if (paymentMethod === 'credit-card') {
      toast({
        title: "Kredi Kartı Şu An Kullanılamıyor",
        description: "Kredi kartı ödemesi şu an için kullanılamamaktadır. Lütfen IBAN EFT-Havale seçeneğini kullanın.",
        variant: "destructive",
      })
      return
    }

    const step1Valid = validateStep1()
    const step2Valid = validateStep2()
    console.log('[CHECKOUT] Validation - Step 1:', step1Valid, 'Step 2:', step2Valid)

    if (!step1Valid || !step2Valid) {
      console.log('[CHECKOUT] Validation başarısız, işlem durduruldu')
      return
    }

    setIsSubmitting(true)
    console.log('[CHECKOUT] Submitting state true yapıldı')

    try {
      // Sync cart first to ensure cart ID is up to date
      console.log('[CHECKOUT] Cart sync başlatılıyor...')
      try {
        await syncCart()
        console.log('[CHECKOUT] Cart sync başarılı')
      } catch (error) {
        console.error("[CHECKOUT] Cart sync hatası:", error)
      }

      // Get cart ID - try from context first, then localStorage, then user cart if authenticated
      const cartIdFromContext = getCartIdFromContext()
      const cartIdFromStorage = getCartId()
      console.log('[CHECKOUT] Cart ID - Context:', cartIdFromContext, 'Storage:', cartIdFromStorage)

      let cartId = cartIdFromContext || cartIdFromStorage
      console.log('[CHECKOUT] İlk cart ID:', cartId)

      if (!cartId && isAuthenticated) {
        console.log('[CHECKOUT] Cart ID bulunamadı, authenticated user için getUserCart deneniyor...')
        // If no cart ID, try to get user cart
        try {
          const userCart = await cartService.getUserCart()
          console.log('[CHECKOUT] getUserCart response:', userCart)
          if (userCart) {
            cartId = userCart.id
            console.log('[CHECKOUT] User cart ID alındı:', cartId)
            // Save to localStorage for next time
            if (typeof window !== 'undefined') {
              localStorage.setItem('shawk_cart_id', userCart.id)
              console.log('[CHECKOUT] Cart ID localStorage\'a kaydedildi')
            }
          }
        } catch (error) {
          console.error("[CHECKOUT] getUserCart hatası:", error)
        }
      }

      console.log('[CHECKOUT] Final cart ID:', cartId)

      if (!cartId) {
        console.error('[CHECKOUT] Cart ID bulunamadı, işlem durduruluyor')
        toast({
          title: "Sepet Bulunamadı",
          description: "Sepetiniz bulunamadı. Lütfen sepet sayfasına dönün ve tekrar deneyin.",
          variant: "destructive",
        })
        // router.push("/sepet")
        setIsSubmitting(false)
        return
      }

      // Shipping address oluştur
      console.log('[CHECKOUT] Shipping address oluşturuluyor...')
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
      console.log('[CHECKOUT] Shipping address:', shippingAddress)

      // Billing address oluştur (varsa)
      let billingAddress
      if (formData.useBillingAddress) {
        console.log('[CHECKOUT] Billing address oluşturuluyor...')
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
        console.log('[CHECKOUT] Billing address:', billingAddress)
      } else {
        console.log('[CHECKOUT] Billing address kullanılmıyor (useBillingAddress: false)')
      }

      // Order oluştur
      console.log('[CHECKOUT] Order DTO oluşturuluyor...')
      
      // Kupon indirimi hesapla
      const orderSubtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
      let orderDiscount = 0
      if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
          orderDiscount = (orderSubtotal * appliedCoupon.discount) / 100
        } else {
          orderDiscount = appliedCoupon.discount
        }
      }
      
      const createOrderDto: CreateOrderDto = {
        cartId,
        shippingAddress,
        billingAddress,
        shippingCost: 0, // Ücretsiz kargo
        discount: orderDiscount,
        notes: formData.notes || undefined,
      }

      // Guest checkout için bilgiler
      if (!isAuthenticated) {
        console.log('[CHECKOUT] Guest checkout bilgileri ekleniyor...')
        createOrderDto.guestEmail = formData.email
        createOrderDto.guestPhone = formData.phone
        createOrderDto.guestFirstName = formData.firstName
        createOrderDto.guestLastName = formData.lastName
        console.log('[CHECKOUT] Guest info:', {
          email: createOrderDto.guestEmail,
          phone: createOrderDto.guestPhone,
          firstName: createOrderDto.guestFirstName,
          lastName: createOrderDto.guestLastName,
        })
      }

      console.log('[CHECKOUT] Order DTO:', JSON.stringify(createOrderDto, null, 2))
      console.log('[CHECKOUT] Order oluşturuluyor (orderService.createOrder)...')

      const order = await orderService.createOrder(createOrderDto)

      console.log('[CHECKOUT] Order oluşturuldu:', order)
      console.log('[CHECKOUT] Order ID:', order.id)

      // IBAN EFT-Havale akışı
      if (paymentMethod === 'iban-eft') {
        console.log('[CHECKOUT] IBAN EFT-Havale akışı başlatılıyor...')
        
        // Toplam tutarı hesapla (indirimli)
        const subtotal = getTotalPrice()
        const shipping = 0
        const ibanDiscount = appliedCoupon ? (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount) : 0
        const total = Math.max(0, subtotal - ibanDiscount + shipping)

        // WhatsApp mesajı oluştur
        let whatsappMessage = `Merhaba, IBAN ile ödeme yapmak istiyorum.

Sipariş Bilgileri:
• Sipariş No: ${order.orderNo}
• Ara Toplam: ${subtotal.toLocaleString("tr-TR")} ₺`
        
        if (ibanDiscount > 0 && appliedCoupon) {
          whatsappMessage += `\n• İndirim (${appliedCoupon.code}): -${ibanDiscount.toLocaleString("tr-TR")} ₺`
        }
        
        whatsappMessage += `\n• Kargo: Ücretsiz
• Toplam Tutar: ${total.toLocaleString("tr-TR")} ₺

İletişim Bilgileri:
• Ad Soyad: ${formData.firstName} ${formData.lastName}
• Telefon: ${formData.phone}
• E-posta: ${formData.email}

Teslimat Adresi:
${formData.address}
${formData.district}, ${formData.city}
${formData.postalCode}

IBAN ile ödeme yapmak istiyorum. Lütfen IBAN bilgilerinizi paylaşabilir misiniz?`

        // WhatsApp URL'i oluştur
        const phoneNumber = "905519770858"
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`

        console.log('[CHECKOUT] WhatsApp URL oluşturuldu:', whatsappUrl)
        console.log('[CHECKOUT] WhatsApp\'a yönlendiriliyor...')

        // WhatsApp'a yönlendir
        window.location.href = whatsappUrl
        return
      }

      // Kredi kartı akışı (Iyzico) - şu an devre dışı ama gelecekte kullanılabilir
      if (paymentMethod === 'credit-card') {
      console.log('[CHECKOUT] Payment checkout başlatılıyor...')
      console.log('[CHECKOUT] Checkout request:', {
        orderId: order.id,
        provider: PaymentProvider.IYZICO,
      })

      const checkoutResponse = await paymentService.createCheckout({
        orderId: order.id,
        provider: PaymentProvider.IYZICO,
      })

      console.log('[CHECKOUT] Checkout response alındı:', checkoutResponse)
      console.log('[CHECKOUT] Redirect URL:', checkoutResponse.redirectUrl)

      // Iyzico payment sayfasına yönlendir
      if (!checkoutResponse.redirectUrl) {
        console.error('[CHECKOUT] Redirect URL bulunamadı!')
        throw new Error("Ödeme sayfası URL'i alınamadı. Lütfen tekrar deneyin.")
      }

      console.log('[CHECKOUT] Iyzico payment sayfasına yönlendiriliyor:', checkoutResponse.redirectUrl)
      console.log('[CHECKOUT] İşlem başarıyla tamamlandı!')

      // Iyzico ödeme sayfasına yönlendir
      window.location.href = checkoutResponse.redirectUrl
        return
      }
    } catch (error: any) {
      console.error("[CHECKOUT] HATA YAKALANDI!")
      console.error("[CHECKOUT] Error type:", typeof error)
      console.error("[CHECKOUT] Error:", error)
      console.error("[CHECKOUT] Error message:", error?.message)
      console.error("[CHECKOUT] Error response:", error?.response)
      console.error("[CHECKOUT] Error response data:", error?.response?.data)
      console.error("[CHECKOUT] Error stack:", error?.stack)

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
  
  // Kupon indirimi hesapla
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0
    
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100
    } else {
      return appliedCoupon.discount
    }
  }
  
  const discount = calculateDiscount()
  const total = Math.max(0, subtotal - discount + shipping)

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
            {[1, 2, 3].map((s) => {
              const isVisited = visitedSteps.has(s)
              const isClickable = isVisited
              
              return (
              <div key={s} className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isClickable) {
                        handleStepChange(s)
                      }
                    }}
                    disabled={!isClickable}
                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium transition-colors ${
                      step >= s 
                        ? "bg-foreground text-background cursor-pointer hover:bg-foreground/90" 
                        : isClickable
                        ? "bg-secondary text-muted-foreground cursor-pointer hover:bg-secondary/80"
                        : "bg-secondary text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                >
                  {s}
                  </button>
                  <button
                    onClick={() => {
                      if (isClickable) {
                        handleStepChange(s)
                      }
                    }}
                    disabled={!isClickable}
                    className={`text-sm hidden sm:inline transition-colors ${
                      step >= s 
                        ? "text-foreground cursor-pointer hover:underline" 
                        : isClickable
                        ? "text-muted-foreground cursor-pointer hover:text-foreground"
                        : "text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                  {s === 1 ? "İletişim" : s === 2 ? "Adres" : "Ödeme"}
                  </button>
                {s < 3 && <div className="w-8 sm:w-16 h-px bg-border" />}
              </div>
              )
            })}
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
                      onClick={() => handleStepChange(1)}
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
                  <h2 className="font-serif text-xl text-foreground mb-6">Ödeme Yöntemi</h2>

                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {/* Kredi Kartı Seçeneği */}
                    <div
                      className={`relative p-6 border-2 rounded-lg cursor-not-allowed ${
                        paymentMethod === 'credit-card'
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-secondary opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <CreditCard className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">Kredi Kartı</h3>
                          <p className="text-sm text-destructive font-medium mb-2">Şu an seçilemez</p>
                          <p className="text-xs text-muted-foreground">iyzico onayı bekleniyor</p>
                        </div>
                      </div>
                    </div>

                    {/* IBAN EFT-Havale Seçeneği */}
                    <div
                      onClick={() => setPaymentMethod('iban-eft')}
                      className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'iban-eft'
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-secondary hover:border-foreground/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          paymentMethod === 'iban-eft' ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          <Building2 className={`w-6 h-6 ${
                            paymentMethod === 'iban-eft' ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground mb-1">IBAN EFT-Havale</h3>
                          <p className="text-xs text-muted-foreground">Banka havalesi ile ödeme yapın</p>
                        </div>
                        {paymentMethod === 'iban-eft' && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* IBAN Seçildiğinde Dekont Gönderme Adımları ve IBAN Bilgileri */}
                  {paymentMethod === 'iban-eft' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Dekont Gönderme Adımları */}
                  <div className="p-6 border border-border bg-secondary">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <h3 className="font-medium text-foreground">Dekont Gönderme Adımları</h3>
                        </div>
                        <div className="space-y-3">
                          <button
                            onClick={() => handleStepChange(2)}
                            className="w-full flex items-start gap-3 text-left hover:bg-background/50 transition-colors p-2 rounded -m-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                              1
                            </div>
                            <div>
                              <p className="text-foreground font-medium text-sm">Belirtilen IBAN'a Ödeme Yapın</p>
                              <p className="text-muted-foreground text-xs mt-0.5">Belirtilen IBAN'a belirtilen tutarı açıklama kısmına sipariş numaranızı yazarak havale/EFT yapın</p>
                              <p className="text-primary text-xs mt-1 font-medium">Adres bilgilerini düzenlemek için tıklayın</p>
                            </div>
                          </button>
                          <button
                            onClick={() => handleStepChange(1)}
                            className="w-full flex items-start gap-3 text-left hover:bg-background/50 transition-colors p-2 rounded -m-2"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                              2
                            </div>
                            <div>
                              <p className="text-foreground font-medium text-sm">Siteye Dönerek WhatsApp ile Devam Edin</p>
                              <p className="text-muted-foreground text-xs mt-0.5">Ödeme işleminizi tamamladıktan sonra siteye dönerek WhatsApp ile devam edin</p>
                              <p className="text-primary text-xs mt-1 font-medium">İletişim bilgilerini düzenlemek için tıklayın</p>
                            </div>
                          </button>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                              3
                            </div>
                            <div>
                              <p className="text-foreground font-medium text-sm">Dekontu WhatsApp Üzerinden Gönderin</p>
                              <p className="text-muted-foreground text-xs mt-0.5">Ödeme dekontunuzu WhatsApp üzerinden bizimle paylaşın</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-medium mt-0.5">
                              4
                            </div>
                            <div>
                              <p className="text-foreground font-medium text-sm">Siparişiniz Onaylanır</p>
                              <p className="text-muted-foreground text-xs mt-0.5">Dekont kontrol edildikten sonra siparişiniz onaylanır</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* IBAN Bilgileri */}
                      <div className="p-6 border border-border bg-secondary space-y-4">
                    <p className="text-sm text-foreground mb-4">
                          IBAN ile ödeme yaptıktan sonra Whatsapp'dan bize alttaki butondan ulaşıp dekontunuzu paylaşınız.
                        </p>
                        
                        {/* IBAN Bilgileri - Placeholder (Backend'den gelecek) */}
                        <div className="p-4 bg-background border border-border rounded-lg space-y-4">
                          {/* IBAN Numarası */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">IBAN Numarası</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-foreground font-mono flex-1">TR00 0000 0000 0000 0000 0000 00</p>
                              <button
                                onClick={() => handleCopy("TR00 0000 0000 0000 0000 0000 00", "iban")}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border hover:bg-secondary transition-colors rounded"
                              >
                                {copiedField === "iban" ? (
                                  <>
                                    <Check className="w-3 h-3 text-green-600" />
                                    <span className="text-green-600">Kopyalandı</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Kopyala</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Hesap İsmi */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Hesap İsmi</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-foreground flex-1">Örnek Şirket Adı</p>
                              <button
                                onClick={() => handleCopy("Örnek Şirket Adı", "accountName")}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border hover:bg-secondary transition-colors rounded"
                              >
                                {copiedField === "accountName" ? (
                                  <>
                                    <Check className="w-3 h-3 text-green-600" />
                                    <span className="text-green-600">Kopyalandı</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Kopyala</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Banka İsmi */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Banka İsmi</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-foreground flex-1">Örnek Banka A.Ş.</p>
                              <button
                                onClick={() => handleCopy("Örnek Banka A.Ş.", "bankName")}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border hover:bg-secondary transition-colors rounded"
                              >
                                {copiedField === "bankName" ? (
                                  <>
                                    <Check className="w-3 h-3 text-green-600" />
                                    <span className="text-green-600">Kopyalandı</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Kopyala</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Fiyat */}
                          <div className="pt-3 border-t border-border">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground">Ödenecek Tutar</p>
                              <div className="flex flex-col items-end">
                                {appliedCoupon && discount > 0 && (
                                  <p className="text-xs text-muted-foreground line-through mb-1">
                                    {subtotal.toLocaleString("tr-TR")} ₺
                                  </p>
                                )}
                                <p className="text-lg font-semibold text-green-600">{total.toLocaleString("tr-TR")} ₺</p>
                              </div>
                            </div>
                          </div>
                  </div>

                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="inline-flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white font-medium text-sm uppercase tracking-wider hover:bg-[#20BA5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              İşleniyor...
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-5 h-5" />
                              WhatsApp ile Devam Et
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-secondary">
                    <Lock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Ödeme bilgileriniz güvenli bir şekilde işlenmektedir.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleStepChange(2)}
                      className="flex-1 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                      disabled={isSubmitting}
                    >
                      Geri
                    </button>
                    {paymentMethod !== 'iban-eft' && (
                    <button
                      onClick={handleSubmit}
                        disabled={isSubmitting || !paymentMethod}
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
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary p-6 sticky top-28">
                <h3 className="font-serif text-lg text-foreground mb-6">Sipariş Özeti</h3>

                {/* Sepet Öğeleri - Her zaman gösterilir */}
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-border mb-6">
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
                      <div className="mt-2">
                        {item.discountedPrice && item.basePrice && item.discountedPrice < item.basePrice ? (
                          <>
                            <p className="text-sm font-medium text-foreground">
                              {(item.discountedPrice * item.quantity).toLocaleString("tr-TR")} ₺
                            </p>
                            <p className="text-xs text-muted-foreground line-through">
                              {(item.basePrice * item.quantity).toLocaleString("tr-TR")} ₺
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {((item.basePrice || item.price) * item.quantity).toLocaleString("tr-TR")} ₺
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="space-y-3 py-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="text-foreground">{subtotal.toLocaleString("tr-TR")} ₺</span>
                  </div>
                  {appliedCoupon && discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        İndirim ({appliedCoupon.code})
                      </span>
                      <span className="text-green-600 font-medium">-{discount.toLocaleString("tr-TR")} ₺</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="text-accent">Ücretsiz</span>
                  </div>
                </div>

                <div className="flex justify-between pt-6 pb-6 border-b border-border">
                  <span className="font-medium text-foreground">Toplam</span>
                  <div className="flex flex-col items-end">
                    {appliedCoupon && discount > 0 && (
                      <span className="text-xs text-muted-foreground line-through mb-1">
                        {subtotal.toLocaleString("tr-TR")} ₺
                      </span>
                    )}
                    <span className="font-serif text-xl text-green-600 font-semibold">{total.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </div>

                {/* Step 1: İletişim Bilgileri Özeti */}
                {step === 1 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <h4 className="font-medium text-foreground">İletişim Bilgileri</h4>
                    </div>
                    {formData.email && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">E-posta</p>
                        <p className="text-foreground">{formData.email}</p>
                      </div>
                    )}
                    {(formData.firstName || formData.lastName) && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Ad Soyad</p>
                        <p className="text-foreground">{formData.firstName} {formData.lastName}</p>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Telefon</p>
                        <p className="text-foreground">{formData.phone}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Adres Bilgileri Özeti */}
                {step === 2 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <h4 className="font-medium text-foreground">Teslimat Adresi</h4>
                    </div>
                    {formData.address && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Adres</p>
                        <p className="text-foreground">{formData.address}</p>
                      </div>
                    )}
                    {(formData.district || formData.city) && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">İlçe / İl</p>
                        <p className="text-foreground">{formData.district} / {formData.city}</p>
                      </div>
                    )}
                    {formData.postalCode && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Posta Kodu</p>
                        <p className="text-foreground">{formData.postalCode}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: İletişim + Adres Özeti + IBAN Dekont Gönderme Adımları */}
                {step === 3 && (
                  <div className="mt-6 space-y-6">
                    {/* İletişim Bilgileri */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium text-foreground text-sm">İletişim Bilgileri</h4>
                      </div>
                      <div className="space-y-2 text-sm pl-6">
                        {formData.email && (
                          <p className="text-foreground">{formData.email}</p>
                        )}
                        {(formData.firstName || formData.lastName) && (
                          <p className="text-foreground">{formData.firstName} {formData.lastName}</p>
                        )}
                        {formData.phone && (
                          <p className="text-foreground">{formData.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Adres Bilgileri */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium text-foreground text-sm">Teslimat Adresi</h4>
                      </div>
                      <div className="space-y-1 text-sm pl-6">
                        {formData.address && (
                          <p className="text-foreground">{formData.address}</p>
                        )}
                        {(formData.district || formData.city) && (
                          <p className="text-foreground">{formData.district} / {formData.city}</p>
                        )}
                        {formData.postalCode && (
                          <p className="text-foreground">{formData.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Güvenlik Bilgileri - Her zaman gösterilir */}
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
