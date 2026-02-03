"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { uploadService } from "@/services/upload.service"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Package,
  MapPin,
  Calendar,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  AlertCircle,
  FileText,
  CheckCircle,
  Settings
} from "lucide-react"
import {
  orderService,
  Order,
  OrderStatus,
  type OrderItem,
  type PersonalizationFieldValue,
} from "@/services/order.service"

const getStatusBadge = (status: OrderStatus) => {
  const statusConfig = {
    [OrderStatus.PENDING]: {
      label: "Beklemede",
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      icon: Clock,
    },
    [OrderStatus.PAID]: {
      label: "Ödendi",
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: CheckCircle2,
    },
    [OrderStatus.PROCESSING]: {
      label: "İşleniyor",
      className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      icon: Loader2,
    },
    [OrderStatus.SHIPPED]: {
      label: "Kargoya Verildi",
      className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      icon: Truck,
    },
    [OrderStatus.DELIVERED]: {
      label: "Teslim Edildi",
      className: "bg-green-500/10 text-green-600 border-green-500/20",
      icon: CheckCircle2,
    },
    [OrderStatus.CANCELLED]: {
      label: "İptal Edildi",
      className: "bg-red-500/10 text-red-600 border-red-500/20",
      icon: XCircle,
    },
    [OrderStatus.REFUNDED]: {
      label: "İade Edildi",
      className: "bg-gray-500/10 text-gray-600 border-gray-500/20",
      icon: XCircle,
    },
  }

  return statusConfig[status] || statusConfig[OrderStatus.PENDING]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Backend URL zenginleştirmesi gelmezse UUID ile upload API'den görsel çeker */
function PersonalizationImage({ value }: { value: string | { id: string; url: string } }) {
  const [url, setUrl] = useState<string | null>(typeof value === "object" && "url" in value ? value.url : null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (url) return
    const id = typeof value === "string" ? value.trim() : value.id
    if (!id || !UUID_REGEX.test(id)) return
    uploadService
      .getUpload(id)
      .then((res) => setUrl(res.url))
      .catch(() => setError(true))
  }, [value, url])

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-md overflow-hidden border border-border hover:opacity-90"
      >
        <img src={url} alt="Kişiselleştirme" className="h-20 w-20 object-cover" />
      </a>
    )
  }
  if (error) return <span className="text-muted-foreground text-xs">Görsel yüklenemedi</span>
  return <span className="text-muted-foreground text-xs">Yükleniyor…</span>
}

/** Kişiselleştirme alan değerini metin veya görsel olarak render et */
function renderPersonalizationValue(value: PersonalizationFieldValue): React.ReactNode {
  if (value == null) return null
  if (typeof value === "string") {
    if (UUID_REGEX.test(value.trim())) return <PersonalizationImage value={value} />
    return <span className="text-foreground">{value}</span>
  }
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {value.map((v, i) => (
          <div key={i}>{renderPersonalizationValue(v)}</div>
        ))}
      </div>
    )
  }
  if (typeof value === "object" && "url" in value) {
    return (
      <a
        href={value.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-md overflow-hidden border border-border hover:opacity-90"
      >
        <img
          src={value.url}
          alt="Kişiselleştirme"
          className="h-20 w-20 object-cover"
        />
      </a>
    )
  }
  if (typeof value === "object" && "id" in value) return <PersonalizationImage value={value as { id: string; url: string }} />
  return null
}

function OrderItemCard({ item }: { item: OrderItem }) {
  const variantLabel =
    item.variant?.variantValues && item.variant.variantValues.length > 0
      ? item.variant.variantValues
        .map((vv) => `${vv.variantOption?.name ?? "Seçenek"}: ${vv.value}`)
        .join(", ")
      : null

  return (
    <div className="p-4 bg-background rounded-lg border border-border space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground">{item.productName}</p>
          {variantLabel && (
            <p className="text-sm text-muted-foreground mt-1">
              {variantLabel}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm shrink-0">
          <div className="text-right">
            <p className="text-muted-foreground">Miktar</p>
            <p className="font-medium text-foreground">{item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Birim Fiyat</p>
            <p className="font-medium text-foreground">
              {item.discountedPrice
                ? item.discountedPrice.toLocaleString("tr-TR")
                : item.unitPrice.toLocaleString("tr-TR")}{" "}
              {item.currency}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Toplam</p>
            <p className="font-semibold text-foreground">
              {item.totalPrice.toLocaleString("tr-TR")} {item.currency}
            </p>
          </div>
        </div>
      </div>

      {item.personalization && (
        <div className="pt-3 border-t border-border">
          <p className="text-sm font-semibold text-foreground mb-2">
            Kişiselleştirme: {item.personalization.form?.title ?? "Özel tasarım"}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {(item.personalization.schemaSnapshot?.fields ?? []).map((field: any) => {
              const fieldKey = field.key ?? field.id
              const value = fieldKey ? item.personalization!.userValues[fieldKey] : undefined
              if (value === undefined) return null
              const label = field.title ?? field.label ?? fieldKey
              return (
                <div key={fieldKey} className="text-sm">
                  <p className="text-muted-foreground font-medium">{label}</p>
                  <div className="mt-0.5">
                    {renderPersonalizationValue(value)}
                  </div>
                </div>
              )
            })}
            {(!item.personalization.schemaSnapshot?.fields?.length &&
              Object.keys(item.personalization.userValues).length > 0) && (
                <div className="sm:col-span-2 space-y-2">
                  {Object.entries(item.personalization.userValues).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <p className="text-muted-foreground font-medium">{key}</p>
                      <div className="mt-0.5">
                        {renderPersonalizationValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Backend sipariş numarası 8 haneli; kullanıcı daha az girerse başa sıfır eklenir */
const ORDER_NO_LENGTH = 8

export default function SiparisSorgulamaPage() {
  const [orderNo, setOrderNo] = useState("")
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setOrder(null)

    const cleaned = orderNo.trim().replace(/\s/g, "")
    if (!cleaned) {
      setError("Lütfen sipariş numarası giriniz.")
      return
    }
    if (!/^\d+$/.test(cleaned)) {
      setError("Sipariş numarası sadece rakamlardan oluşmalıdır.")
      return
    }
    if (cleaned.length > ORDER_NO_LENGTH) {
      setError(`Sipariş numarası en fazla ${ORDER_NO_LENGTH} haneli olmalıdır.`)
      return
    }

    const orderNoPadded = cleaned.padStart(ORDER_NO_LENGTH, "0")

    setIsLoading(true)
    try {
      const orderData = await orderService.getOrderByOrderNo(orderNoPadded)
      setOrder(orderData)
      setError(null)
    } catch (err: any) {
      console.error("Sipariş sorgulama hatası:", err)
      const status = err?.response?.status
      const message = err?.response?.data?.message
      if (status === 404) {
        setError("Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol ediniz.")
      } else if (status === 403) {
        setError("Bu sipariş giriş yapılmış bir hesapla verilmiştir. Siparişinizi görmek için lütfen giriş yapın.")
      } else {
        setError(message || "Sipariş sorgulanırken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.")
      }
      setOrder(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= ORDER_NO_LENGTH) {
      setOrderNo(value)
      setError(null)
    }
  }

  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px] min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-12 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Sipariş Sorgulama
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight text-balance mb-6">
                Siparişinizi Sorgulayın
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sipariş numaranızı girerek siparişinizin durumunu ve detaylarını öğrenebilirsiniz.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search Form Section */}
        <section className="py-12 bg-background">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="orderNo" className="block text-base sm:text-lg font-medium text-foreground mb-4">
                    Sipariş Numarası <span className="text-destructive">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Input
                        type="text"
                        id="orderNo"
                        name="orderNo"
                        value={orderNo}
                        onChange={handleInputChange}
                        placeholder={`${ORDER_NO_LENGTH} haneli sipariş numaranızı giriniz`}
                        maxLength={ORDER_NO_LENGTH}
                        className="pr-14 h-16 text-lg sm:text-xl px-6 text-foreground placeholder:text-muted-foreground/60"
                        disabled={isLoading}
                      />
                      <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground pointer-events-none" />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading || !orderNo.trim()}
                      className="h-16 px-10 sm:px-12 text-base sm:text-lg font-semibold"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                          Sorgulanıyor...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                          Sorgula
                        </>
                      )}
                    </Button>
                  </div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 text-sm text-destructive"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Order Status Timeline */}
        {order && (
          <section className="py-8 bg-background">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-secondary p-6 lg:p-8 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    Sipariş Durumu
                  </h3>
                </div>

                <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-4">
                  {/* Mobil için Dikey Progress Bar - Sol tarafta */}
                  <div className="sm:hidden absolute left-0 top-0 bottom-0 w-1.5">
                    {(() => {
                      // Hangi aşamada olduğunu belirle (sadece aktif aşama)
                      let currentStep = 0
                      if (order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID) {
                        currentStep = 1
                      } else if (order.status === OrderStatus.PROCESSING) {
                        currentStep = 2
                      } else if (order.status === OrderStatus.SHIPPED) {
                        currentStep = 3
                      } else if (order.status === OrderStatus.DELIVERED) {
                        currentStep = 4
                      }

                      // Her adım için pozisyon hesapla (4 adım, her biri eşit aralıklı)
                      // İlk adım %12.5, ikinci %37.5, üçüncü %62.5, dördüncü %87.5
                      const stepPositions = [12.5, 37.5, 62.5, 87.5]
                      const filledHeight = currentStep > 0 ? stepPositions[currentStep - 1] : 0
                      const activeStepPosition = currentStep > 0 ? stepPositions[currentStep - 1] : null

                      return (
                        <div className="relative h-full">
                          {/* Arka plan bar */}
                          <div className="absolute top-0 left-0 w-full h-full bg-muted/30 rounded-full" />
                          {/* Dolu bar - sadece aktif aşamaya kadar */}
                          {currentStep > 0 && (
                            <div
                              className="absolute top-0 left-0 w-full bg-primary transition-all duration-500 ease-out rounded-full"
                              style={{ height: `${filledHeight}%` }}
                            />
                          )}
                          {/* Aktif aşama çıkıntısı */}
                          {activeStepPosition !== null && (
                            <div
                              className="absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full border-2 border-background shadow-lg z-10"
                              style={{ top: `${activeStepPosition}%`, marginTop: '-10px' }}
                            />
                          )}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Sipariş Alındı */}
                  {(() => {
                    const isActive = order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID
                    return (
                      <div className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0 pl-8 sm:pl-0">
                        {/* Mobil Icon */}
                        <div className="sm:hidden relative flex-shrink-0">
                          <div
                            className={`rounded-full flex items-center justify-center transition-all ${isActive
                              ? "w-16 h-16 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-12 h-12 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <Package className={isActive ? "w-8 h-8" : "w-6 h-6"} />
                          </div>
                        </div>
                        {/* Desktop Icon */}
                        <div className="hidden sm:block">
                          <div
                            className={`rounded-full flex items-center justify-center mb-3 transition-all ${isActive
                              ? "w-20 h-20 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-16 h-16 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <Package className={isActive ? "w-10 h-10" : "w-8 h-8"} />
                          </div>
                        </div>
                        <div className="flex-1 sm:flex-none">
                          <p
                            className={`transition-all ${isActive
                              ? "font-bold text-base sm:text-lg text-foreground"
                              : "font-medium text-sm text-muted-foreground opacity-50"
                              }`}
                          >
                            Sipariş Alındı
                          </p>
                          {isActive && (
                            <p className="text-xs text-primary font-semibold mt-1">Aktif</p>
                          )}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Hazırlanıyor */}
                  {(() => {
                    const isActive = order.status === OrderStatus.PROCESSING
                    return (
                      <div className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0 pl-8 sm:pl-0">
                        {/* Mobil Icon */}
                        <div className="sm:hidden relative flex-shrink-0">
                          <div
                            className={`rounded-full flex items-center justify-center transition-all ${isActive
                              ? "w-16 h-16 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-12 h-12 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <Settings className="w-6 h-6" />
                          </div>
                        </div>
                        {/* Desktop Icon */}
                        <div className="hidden sm:block">
                          <div
                            className={`rounded-full flex items-center justify-center mb-3 transition-all ${isActive
                              ? "w-20 h-20 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-16 h-16 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <Settings className="w-8 h-8" />
                          </div>
                        </div>
                        <div className="flex-1 sm:flex-none">
                          <p
                            className={`transition-all ${isActive
                              ? "font-bold text-base sm:text-lg text-foreground"
                              : "font-medium text-sm text-muted-foreground opacity-50"
                              }`}
                          >
                            Hazırlanıyor
                          </p>
                          {isActive && (
                            <p className="text-xs text-primary font-semibold mt-1">Aktif</p>
                          )}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Kargoda */}
                  {(() => {
                    const isActive = order.status === OrderStatus.SHIPPED
                    return (
                      <div className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0 pl-8 sm:pl-0">
                        {/* Mobil Icon */}
                        <div className="sm:hidden relative flex-shrink-0">
                          <div
                            className={`rounded-full flex items-center justify-center transition-all ${isActive
                              ? "w-16 h-16 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-12 h-12 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <Truck className={isActive ? "w-8 h-8" : "w-6 h-6"} />
                          </div>
                        </div>
                        {/* Desktop Icon */}
                        <div className="hidden sm:block">
                          <div
                            className={`rounded-full flex items-center justify-center mb-3 transition-all ${isActive
                              ? "w-20 h-20 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-16 h-16 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <Truck className={isActive ? "w-10 h-10" : "w-8 h-8"} />
                          </div>
                        </div>
                        <div className="flex-1 sm:flex-none">
                          <p
                            className={`transition-all ${isActive
                              ? "font-bold text-base sm:text-lg text-foreground"
                              : "font-medium text-sm text-muted-foreground opacity-50"
                              }`}
                          >
                            Kargoda
                          </p>
                          {isActive && (
                            <p className="text-xs text-primary font-semibold mt-1">Aktif</p>
                          )}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Teslim Edildi */}
                  {(() => {
                    const isActive = order.status === OrderStatus.DELIVERED
                    return (
                      <div className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0 pl-8 sm:pl-0">
                        {/* Mobil Icon */}
                        <div className="sm:hidden relative flex-shrink-0">
                          <div
                            className={`rounded-full flex items-center justify-center transition-all ${isActive
                              ? "w-16 h-16 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-12 h-12 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <CheckCircle2 className={isActive ? "w-8 h-8" : "w-6 h-6"} />
                          </div>
                        </div>
                        {/* Desktop Icon */}
                        <div className="hidden sm:block">
                          <div
                            className={`rounded-full flex items-center justify-center mb-3 transition-all ${isActive
                              ? "w-20 h-20 bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                              : "w-16 h-16 bg-muted/50 text-muted-foreground opacity-50"
                              }`}
                          >
                            <CheckCircle2 className={isActive ? "w-10 h-10" : "w-8 h-8"} />
                          </div>
                        </div>
                        <div className="flex-1 sm:flex-none">
                          <p
                            className={`transition-all ${isActive
                              ? "font-bold text-base sm:text-lg text-foreground"
                              : "font-medium text-sm text-muted-foreground opacity-50"
                              }`}
                          >
                            Teslim Edildi
                          </p>
                          {isActive && (
                            <p className="text-xs text-primary font-semibold mt-1">Tamamlandı</p>
                          )}
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Bağlantı Çizgileri - Desktop */}
                <div className="hidden sm:block relative mt-6">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted/30 -translate-y-1/2 rounded-full" />
                  <div className="relative flex justify-between px-8">
                    {[
                      order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID,
                      order.status === OrderStatus.PROCESSING,
                      order.status === OrderStatus.SHIPPED,
                      order.status === OrderStatus.DELIVERED,
                    ].map((isActive, index) => {
                      // Her adım için doluluk hesapla
                      let fillWidth = 0
                      if (order.status === OrderStatus.PENDING || order.status === OrderStatus.PAID) {
                        fillWidth = index === 0 ? 100 : 0
                      } else if (order.status === OrderStatus.PROCESSING) {
                        fillWidth = index <= 1 ? 100 : 0
                      } else if (order.status === OrderStatus.SHIPPED) {
                        fillWidth = index <= 2 ? 100 : 0
                      } else if (order.status === OrderStatus.DELIVERED) {
                        fillWidth = 100
                      }

                      return (
                        <div
                          key={index}
                          className="relative h-1 flex-1 mx-1 rounded-full overflow-hidden bg-muted/30"
                        >
                          <div
                            className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 rounded-full ${fillWidth > 0 ? "w-full" : "w-0"
                              }`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Order Details Section */}
        {order && (
          <section className="py-12 bg-background">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {/* Sol Taraf - Sipariş Bilgileri */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Header */}
                  <div className="bg-secondary p-6 lg:p-8 rounded-lg border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Sipariş Numarası</p>
                        <p className="font-serif text-2xl font-bold text-foreground">{order.orderNo}</p>
                      </div>
                      {(() => {
                        const statusInfo = getStatusBadge(order.status)
                        const StatusIcon = statusInfo.icon
                        return (
                          <Badge
                            variant="outline"
                            className={`${statusInfo.className} border px-4 py-2 text-sm font-semibold`}
                          >
                            <StatusIcon className="w-4 h-4 mr-2" />
                            {statusInfo.label}
                          </Badge>
                        )
                      })()}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Sipariş Tarihi</p>
                          <p className="font-medium text-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Toplam Tutar</p>
                          <p className="font-medium text-foreground text-lg">
                            {order.total.toLocaleString("tr-TR")} {order.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-secondary p-6 lg:p-8 rounded-lg border border-border">
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Sipariş Detayları
                      </h3>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <OrderItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-secondary p-6 lg:p-8 rounded-lg border border-border">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Sipariş Özeti
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ara Toplam</span>
                        <span className="font-medium text-foreground">
                          {order.subtotal.toLocaleString("tr-TR")} {order.currency}
                        </span>
                      </div>
                      {order.shippingCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Kargo Ücreti</span>
                          <span className="font-medium text-foreground">
                            {order.shippingCost.toLocaleString("tr-TR")} {order.currency}
                          </span>
                        </div>
                      )}
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>İndirim</span>
                          <span className="font-medium">
                            -{order.discount.toLocaleString("tr-TR")} {order.currency}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-3 border-t border-border">
                        <span className="font-semibold text-foreground">Toplam</span>
                        <span className="font-bold text-lg text-foreground">
                          {order.total.toLocaleString("tr-TR")} {order.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="bg-secondary p-6 lg:p-8 rounded-lg border border-border">
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Notlar</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Sağ Taraf - Adresler */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="bg-secondary p-6 lg:p-8 rounded-lg border border-border">
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Teslimat Adresi
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                        <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                        <p className="text-muted-foreground">
                          {order.shippingAddress.district} / {order.shippingAddress.city}
                        </p>
                        <p className="text-muted-foreground">
                          {order.shippingAddress.postalCode}
                          {order.shippingAddress.country && ` - ${order.shippingAddress.country}`}
                        </p>
                        {order.shippingAddress.phone && (
                          <p className="text-muted-foreground mt-2">Tel: {order.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Billing Address */}
                  {order.billingAddress && (
                    <div className="bg-secondary p-6 lg:p-8 rounded-lg border border-border">
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Fatura Adresi
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-foreground">
                          {order.billingAddress.firstName} {order.billingAddress.lastName}
                        </p>
                        <p className="text-muted-foreground">{order.billingAddress.address}</p>
                        <p className="text-muted-foreground">
                          {order.billingAddress.district} / {order.billingAddress.city}
                        </p>
                        <p className="text-muted-foreground">
                          {order.billingAddress.postalCode}
                          {order.billingAddress.country && ` - ${order.billingAddress.country}`}
                        </p>
                        {order.billingAddress.phone && (
                          <p className="text-muted-foreground mt-2">Tel: {order.billingAddress.phone}</p>
                        )}
                        {order.billingAddress.taxNumber && (
                          <p className="text-muted-foreground mt-2">
                            Vergi No: {order.billingAddress.taxNumber}
                          </p>
                        )}
                        {order.billingAddress.taxOffice && (
                          <p className="text-muted-foreground">Vergi Dairesi: {order.billingAddress.taxOffice}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
