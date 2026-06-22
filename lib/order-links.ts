/**
 * Sipariş başarı sayfası ve paylaşılabilir link yardımcıları.
 */

/** localStorage'da saklanan son sipariş kaydı */
export interface RecentOrderRecord {
  orderId: string
  orderNo: string
  total: number
  currency: string
  createdAt: string
  successUrl: string
}

const RECENT_ORDERS_STORAGE_KEY = "compass_recent_orders"
const MAX_RECENT_ORDERS = 20

/**
 * Site kök URL'ini ortam değişkeninden veya varsayılan domain'den döndürür.
 */
export function getSiteBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://www.compass.com.tr"
  return configured.replace(/\/+$/, "")
}

/**
 * Ödeme başarı sayfasının tam URL'sini üretir.
 */
export function buildOrderSuccessUrl(
  orderId: string,
  options?: { awaitingConfirmation?: boolean; baseUrl?: string },
): string {
  const base = (options?.baseUrl ?? getSiteBaseUrl()).replace(/\/+$/, "")
  const params = new URLSearchParams({ orderId })
  if (options?.awaitingConfirmation) {
    params.set("awaitingConfirmation", "true")
  }
  return `${base}/odeme/basarili?${params.toString()}`
}

/**
 * Sipariş sorgulama sayfasının tam URL'sini üretir.
 */
export function buildOrderLookupUrl(orderNo: string, baseUrl?: string): string {
  const base = (baseUrl ?? getSiteBaseUrl()).replace(/\/+$/, "")
  const params = new URLSearchParams({ orderNo })
  return `${base}/siparis-sorgulama?${params.toString()}`
}

/**
 * Başarılı siparişi tarayıcıda saklar; Alışverişlerim sayfasında yedek liste olarak kullanılır.
 */
export function saveRecentOrder(record: RecentOrderRecord): void {
  if (typeof window === "undefined") return

  const existing = getRecentOrders().filter((item) => item.orderId !== record.orderId)
  const next = [record, ...existing].slice(0, MAX_RECENT_ORDERS)
  localStorage.setItem(RECENT_ORDERS_STORAGE_KEY, JSON.stringify(next))
}

/**
 * Tarayıcıda saklanan son siparişleri döndürür.
 */
export function getRecentOrders(): RecentOrderRecord[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(RECENT_ORDERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecentOrderRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
