"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { orderService, Order, OrderStatus } from "@/services/order.service"
import {
  buildOrderSuccessUrl,
  getRecentOrders,
  type RecentOrderRecord,
} from "@/lib/order-links"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/** Sipariş durum etiketlerini döndürür. */
function getStatusLabel(status: OrderStatus): { label: string; className: string } {
  const map: Record<OrderStatus, { label: string; className: string }> = {
    [OrderStatus.PENDING]: {
      label: "Beklemede",
      className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    },
    [OrderStatus.PAID]: {
      label: "Ödendi",
      className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    },
    [OrderStatus.PROCESSING]: {
      label: "İşleniyor",
      className: "bg-orange-500/10 text-orange-700 border-orange-500/20",
    },
    [OrderStatus.SHIPPED]: {
      label: "Kargoda",
      className: "bg-purple-500/10 text-purple-700 border-purple-500/20",
    },
    [OrderStatus.DELIVERED]: {
      label: "Teslim Edildi",
      className: "bg-green-500/10 text-green-700 border-green-500/20",
    },
    [OrderStatus.CANCELLED]: {
      label: "İptal Edildi",
      className: "bg-red-500/10 text-red-700 border-red-500/20",
    },
    [OrderStatus.REFUNDED]: {
      label: "İade Edildi",
      className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
    },
  }

  return map[status] ?? map[OrderStatus.PENDING]
}

/** Sipariş tarihini okunabilir formata çevirir. */
function formatOrderDate(dateString: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

interface OrderListEntry {
  orderId: string
  orderNo: string
  total: number
  currency: string
  createdAt: string
  status?: OrderStatus
  successUrl: string
}

/**
 * API ve localStorage kaynaklarını birleştirip benzersiz sipariş listesi üretir.
 */
function mergeOrderEntries(apiOrders: Order[], recentOrders: RecentOrderRecord[]): OrderListEntry[] {
  const map = new Map<string, OrderListEntry>()

  for (const order of apiOrders) {
    map.set(order.id, {
      orderId: order.id,
      orderNo: order.orderNo || order.id,
      total: order.total,
      currency: order.currency,
      createdAt: order.createdAt,
      status: order.status,
      successUrl: buildOrderSuccessUrl(order.id),
    })
  }

  for (const order of recentOrders) {
    if (!map.has(order.orderId)) {
      map.set(order.orderId, {
        orderId: order.orderId,
        orderNo: order.orderNo,
        total: order.total,
        currency: order.currency,
        createdAt: order.createdAt,
        successUrl: order.successUrl,
      })
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/**
 * Giriş yapmış kullanıcının sipariş geçmişini listeler.
 */
export function MyOrdersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const highlightedOrderId = searchParams.get("orderId")
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<OrderListEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      router.replace(`/giris?redirect=${encodeURIComponent("/siparislerim")}`)
      return
    }

    /**
     * Kullanıcının siparişlerini API ve localStorage kaynaklarından yükler.
     */
    const loadOrders = async () => {
      setIsLoading(true)
      setError(null)

      const recentOrders = getRecentOrders()
      try {
        const apiOrders = await orderService.getMyOrders({ limit: 50 })
        setOrders(mergeOrderEntries(apiOrders, recentOrders))
      } catch (loadError) {
        console.error("Siparişler yüklenemedi:", loadError)
        const fallback = mergeOrderEntries([], recentOrders)
        setOrders(fallback)
        setError(
          fallback.length > 0
            ? "Tüm sipariş geçmişi yüklenemedi; yalnızca bu cihazda kayıtlı siparişler gösteriliyor."
            : "Siparişleriniz yüklenemedi. Lütfen daha sonra tekrar deneyin.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [authLoading, isAuthenticated, router])

  const highlightedExists = useMemo(
    () => orders.some((order) => order.orderId === highlightedOrderId),
    [orders, highlightedOrderId],
  )

  if (authLoading || isLoading) {
    return (
      <section className="py-24 bg-background min-h-screen">
        <div className="mx-auto max-w-5xl px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 sm:py-24 bg-background min-h-screen">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Hesabım
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">Alışverişlerim</h1>
          <p className="text-muted-foreground mb-8">
            Tamamlanan siparişlerinize başarı linki üzerinden tekrar ulaşabilirsiniz.
          </p>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-foreground">
              <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
              <span>{error}</span>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-border bg-secondary/40 p-10 text-center">
              <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <h2 className="font-medium text-lg text-foreground mb-2">Henüz siparişiniz yok</h2>
              <p className="text-sm text-muted-foreground mb-6">
                İlk siparişinizi verdikten sonra başarı linkiniz burada listelenecektir.
              </p>
              <Button asChild>
                <Link href="/urunler">Ürünlere Göz At</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = order.status ? getStatusLabel(order.status) : null
                const isHighlighted = highlightedOrderId === order.orderId

                return (
                  <div
                    key={order.orderId}
                    className={`rounded-2xl border p-6 bg-card ${
                      isHighlighted ? "border-primary shadow-sm ring-1 ring-primary/20" : "border-border"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="font-medium text-lg text-foreground">
                            Sipariş #{order.orderNo}
                          </h2>
                          {statusInfo && (
                            <Badge variant="outline" className={statusInfo.className}>
                              {statusInfo.label}
                            </Badge>
                          )}
                          {isHighlighted && (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                              Son sipariş
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatOrderDate(order.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            {order.total.toLocaleString("tr-TR")} {order.currency}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild>
                          <Link href={order.successUrl}>Başarı Linkini Aç</Link>
                        </Button>
                        <Button variant="outline" asChild className="gap-2">
                          <Link href={`/siparis-sorgulama?orderNo=${order.orderNo}`}>
                            <ExternalLink className="h-4 w-4" />
                            Sipariş Detayı
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {!highlightedExists && highlightedOrderId && orders.length > 0 && (
            <p className="mt-6 text-sm text-muted-foreground">
              Aradığınız sipariş listede görünmüyorsa{" "}
              <Link
                href={buildOrderSuccessUrl(highlightedOrderId)}
                className="text-primary hover:underline"
              >
                başarı linkinizi
              </Link>{" "}
              doğrudan açabilirsiniz.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
