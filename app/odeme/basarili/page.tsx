"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { CheckCircle2, Package, Home, ShoppingBag, Loader2, Clock } from "lucide-react"
import { orderService, Order } from "@/services/order.service"
import { useCart } from "@/contexts/cart-context"
import { gtmPurchase } from "@/lib/gtm"
import { OrderSuccessLink } from "@/components/order-success-link"
import {
  buildOrderLookupUrl,
  buildOrderSuccessUrl,
  saveRecentOrder,
} from "@/lib/order-links"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const awaitingConfirmation = searchParams.get("awaitingConfirmation") === "true"
  const { clearCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [successUrl, setSuccessUrl] = useState("")
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!orderId) {
      router.push("/sepet")
      return
    }

    // Sadece bir kere fetch yap
    if (hasFetched.current) {
      return
    }

    const fetchOrder = async () => {
      try {
        hasFetched.current = true
        const orderData = await orderService.getOrderById(orderId)
        setOrder(orderData)
        const resolvedSuccessUrl = buildOrderSuccessUrl(orderId, {
          awaitingConfirmation,
          baseUrl: window.location.origin,
        })
        setSuccessUrl(resolvedSuccessUrl)
        saveRecentOrder({
          orderId: orderData.id,
          orderNo: orderData.orderNo || orderData.id,
          total: orderData.total,
          currency: orderData.currency,
          createdAt: orderData.createdAt,
          successUrl: resolvedSuccessUrl,
        })
        // GTM dataLayer — purchase (satın alma tamamlandı)
        if (orderData) {
          gtmPurchase({
            transaction_id: orderData.orderNo || orderData.id,
            value: orderData.total,
            currency: orderData.currency || 'TRY',
            items: (orderData.items || []).map((item: any, index: number) => ({
              item_id: item.productId || item.id,
              item_name: item.productName || item.name || 'Ürün',
              item_variant: item.variantId || undefined,
              price: item.unitPrice ?? item.price ?? 0,
              quantity: item.quantity ?? 1,
              index,
            })),
          })
        }
        // Sepeti temizle
        clearCart()
      } catch (error) {
        console.error("Failed to fetch order:", error)
        hasFetched.current = false // Hata durumunda tekrar denemek için
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]) // router ve clearCart'ı dependency'den çıkardık

  if (isLoading) {
    return (
      <>
        <main>
          <section className="py-24 bg-background min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  if (!order) {
    return (
      <>
        <main>
          <section className="py-24 bg-background min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center">
                <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">Sipariş Bulunamadı</h1>
                <p className="text-muted-foreground mb-8">Sipariş bilgileri yüklenemedi.</p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                >
                  Ana Sayfaya Dön
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main>
        <section className="py-24 bg-background min-h-screen">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="mb-8">
                {awaitingConfirmation ? (
                  <>
                    <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Clock className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
                      Siparişiniz Onay Bekliyor
                    </h1>
                    <p className="text-muted-foreground text-lg mb-4">
                      Siparişiniz alındı ve ödeme dekontunuzun kontrol edilmesi bekleniyor.
                    </p>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-foreground">
                        <strong>Önemli:</strong> WhatsApp üzerinden gönderdiğiniz ödeme dekontu kontrol edildikten sonra siparişiniz onaylanacaktır. Onaylandığında size bilgi verilecektir.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
                      Ödemeniz Başarıyla Tamamlandı!
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      Siparişiniz alındı ve ödeme işleminiz başarıyla tamamlandı.
                    </p>
                  </>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 mb-8 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Sipariş Numarası</p>
                      <p className="font-medium text-slate-950 text-lg">{order.orderNo || order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Toplam Tutar</p>
                      <p className="font-medium text-slate-950 text-lg">
                        {order.total.toLocaleString("tr-TR")} {order.currency}
                      </p>
                    </div>
                  </div>
                  {order.shippingAddress && (
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Teslimat Adresi</p>
                      <p className="text-sm text-slate-800">
                        {order.shippingAddress.address}
                        <br />
                        {order.shippingAddress.district} / {order.shippingAddress.city}
                        <br />
                        {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {successUrl && (
                <div className="mb-8">
                  <OrderSuccessLink
                    successUrl={successUrl}
                    orderNo={order.orderNo || order.id}
                    lookupUrl={buildOrderLookupUrl(order.orderNo || order.id, window.location.origin)}
                  />
                </div>
              )}

              <div className="space-y-4">
                {awaitingConfirmation ? (
                  <p className="text-sm text-muted-foreground">
                    Sipariş onaylandığında size e-posta ve WhatsApp üzerinden bilgi verilecektir.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sipariş onayı ve detayları için WhatsApp üzerinden size bilgi verilecektir.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Ana Sayfaya Dön
                  </Link>
                  {order.userId ? (
                    <Link
                      href={`/siparislerim?orderId=${order.id}`}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Alışverişlerim
                    </Link>
                  ) : (
                    <Link
                      href={buildOrderLookupUrl(order.orderNo || order.id)}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Sipariş Sorgula
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <>
        <main>
          <section className="py-24 bg-background min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
