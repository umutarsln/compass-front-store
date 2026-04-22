/**
 * Google Tag Manager — dataLayer yardımcısı
 *
 * 2026 GA4 Enhanced Ecommerce standartlarına uygun tip tanımları ve push fonksiyonları.
 * Tüm bileşenler bu dosyayı kullanarak dataLayer'a veri yazar.
 * GTM Container ID: GTM-5N8PB529
 */

// ─── Tip Tanımları ────────────────────────────────────────────────────────────

/** GA4 Ecommerce ürün öğesi */
export interface GtmItem {
  item_id: string
  item_name: string
  item_category?: string
  item_variant?: string
  price?: number
  quantity?: number
  discount?: number
  index?: number
  item_list_id?: string
  item_list_name?: string
  affiliation?: string
}

/** GA4 Ecommerce parametreleri (her ecommerce eventinde kullanılan ortak alan) */
export interface GtmEcommercePayload {
  currency?: string
  value?: number
  items?: GtmItem[]
  transaction_id?: string
  tax?: number
  shipping?: number
  coupon?: string
}

export type GtmEventName =
  // — GA4 Standart Ecommerce Olayları —
  | 'page_view'
  | 'view_item'
  | 'view_item_list'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'purchase'
  // — Özel Lead/Etkileşim Olayları —
  | 'phone_call_click'
  | 'whatsapp_click'
  | 'whatsapp_quote_click'
  | 'generate_lead'

export interface GtmEventPayload {
  event: GtmEventName
  /** dataLayer temizleme: ecommerce eventleri arasında karışmaması için */
  ecommerce?: GtmEcommercePayload | null
  // Özel boyutlar / metrikler
  page_path?: string
  page_title?: string
  page_location?: string
  phone_number?: string
  whatsapp_number?: string
  product_id?: string
  product_name?: string
  lead_source?: string
  [key: string]: unknown
}

// ─── dataLayer Push ───────────────────────────────────────────────────────────

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

/**
 * dataLayer'a güvenli şekilde veri gönderir.
 * SSR'da veya pencere mevcut değilse sessizce atlar.
 */
export function gtmPush(payload: GtmEventPayload): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
  if (process.env.NODE_ENV === 'development') {
    console.log('[GTM]', payload.event, payload)
  }
}

/**
 * Ecommerce eventlerinden önce önceki ecommerce nesnesini temizler.
 * GA4 best-practice: her ecommerce eventinde önce null push edilmeli.
 */
function clearEcommerce(): void {
  gtmPush({ event: 'page_view', ecommerce: null } as unknown as GtmEventPayload)
  // Daha temiz yol: sadece ecommerce temizliği
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ ecommerce: null })
  }
}

// ─── Sayfa Görüntüleme ────────────────────────────────────────────────────────

/**
 * Sanal sayfa görüntüleme olayı (SPA için route değişikliklerinde çağrılır).
 */
export function gtmPageView(params: {
  page_path: string
  page_title?: string
  page_location?: string
}): void {
  gtmPush({
    event: 'page_view',
    page_path: params.page_path,
    page_title: params.page_title || (typeof document !== 'undefined' ? document.title : ''),
    page_location: params.page_location || (typeof window !== 'undefined' ? window.location.href : ''),
  })
}

// ─── Ürün Görüntüleme ─────────────────────────────────────────────────────────

/**
 * Ürün detay sayfası görüntülendiğinde tetiklenir (view_item).
 */
export function gtmViewItem(params: {
  item: GtmItem
  value?: number
  currency?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'view_item',
    ecommerce: {
      currency: params.currency ?? 'TRY',
      value: params.value ?? params.item.price ?? 0,
      items: [params.item],
    },
  })
}

/**
 * Ürün listesi görüntülendiğinde tetiklenir (view_item_list).
 */
export function gtmViewItemList(params: {
  items: GtmItem[]
  item_list_id?: string
  item_list_name?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'view_item_list',
    ecommerce: {
      items: params.items.map((item, index) => ({
        ...item,
        index: item.index ?? index,
        item_list_id: params.item_list_id,
        item_list_name: params.item_list_name,
      })),
    },
  })
}

// ─── Sepet Olayları ───────────────────────────────────────────────────────────

/**
 * Ürün sepete eklendiğinde tetiklenir (add_to_cart).
 */
export function gtmAddToCart(params: {
  item: GtmItem
  value?: number
  currency?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'add_to_cart',
    ecommerce: {
      currency: params.currency ?? 'TRY',
      value: params.value ?? (params.item.price ?? 0) * (params.item.quantity ?? 1),
      items: [params.item],
    },
  })
}

/**
 * Ürün sepetten çıkarıldığında tetiklenir (remove_from_cart).
 */
export function gtmRemoveFromCart(params: {
  item: GtmItem
  value?: number
  currency?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'remove_from_cart',
    ecommerce: {
      currency: params.currency ?? 'TRY',
      value: params.value ?? (params.item.price ?? 0) * (params.item.quantity ?? 1),
      items: [params.item],
    },
  })
}

/**
 * Sepet sayfası görüntülendiğinde tetiklenir (view_cart).
 */
export function gtmViewCart(params: {
  items: GtmItem[]
  value?: number
  currency?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'view_cart',
    ecommerce: {
      currency: params.currency ?? 'TRY',
      value: params.value ?? 0,
      items: params.items,
    },
  })
}

// ─── Ödeme Olayları ───────────────────────────────────────────────────────────

/**
 * Ödeme akışı başladığında tetiklenir (begin_checkout).
 */
export function gtmBeginCheckout(params: {
  items: GtmItem[]
  value?: number
  currency?: string
  coupon?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'begin_checkout',
    ecommerce: {
      currency: params.currency ?? 'TRY',
      value: params.value ?? 0,
      coupon: params.coupon,
      items: params.items,
    },
  })
}

/**
 * Ödeme bilgisi girildiğinde tetiklenir (add_payment_info).
 */
export function gtmAddPaymentInfo(params: {
  items: GtmItem[]
  value?: number
  currency?: string
  payment_type?: string
  coupon?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'add_payment_info',
    ecommerce: {
      currency: params.currency ?? 'TRY',
      value: params.value ?? 0,
      coupon: params.coupon,
      items: params.items,
    },
    payment_type: params.payment_type,
  })
}

/**
 * Satın alma tamamlandığında tetiklenir (purchase).
 */
export function gtmPurchase(params: {
  transaction_id: string
  value: number
  items: GtmItem[]
  currency?: string
  tax?: number
  shipping?: number
  coupon?: string
}): void {
  clearEcommerce()
  gtmPush({
    event: 'purchase',
    ecommerce: {
      transaction_id: params.transaction_id,
      currency: params.currency ?? 'TRY',
      value: params.value,
      tax: params.tax ?? 0,
      shipping: params.shipping ?? 0,
      coupon: params.coupon,
      items: params.items,
    },
  })
}

// ─── Lead / Etkileşim Olayları ────────────────────────────────────────────────

/**
 * Telefon butonu tıklandığında tetiklenir.
 */
export function gtmPhoneCallClick(phoneNumber: string): void {
  gtmPush({
    event: 'phone_call_click',
    phone_number: phoneNumber,
    lead_source: 'phone_fab',
  })
}

/**
 * WhatsApp genel butonu tıklandığında tetiklenir.
 */
export function gtmWhatsAppClick(phoneNumber: string): void {
  gtmPush({
    event: 'whatsapp_click',
    whatsapp_number: phoneNumber,
    lead_source: 'whatsapp_fab',
  })
}

/**
 * Ürün sayfasındaki "Teklif Al" WhatsApp butonuna tıklandığında tetiklenir.
 */
export function gtmWhatsAppQuoteClick(params: {
  phoneNumber: string
  productId?: string
  productName?: string
}): void {
  gtmPush({
    event: 'whatsapp_quote_click',
    whatsapp_number: params.phoneNumber,
    product_id: params.productId,
    product_name: params.productName,
    lead_source: 'whatsapp_quote_button',
  })
}
