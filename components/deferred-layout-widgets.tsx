"use client"

import dynamic from "next/dynamic"

/** Sepet yan paneli yüklenirken yer tutucu göstermez; kapalıyken görünmez. */
function CartSidebarPlaceholder() {
  return null
}

const CartSidebar = dynamic(
  () => import("@/components/cart-sidebar").then((mod) => mod.CartSidebar),
  { ssr: false, loading: CartSidebarPlaceholder },
)

const PhoneCallButton = dynamic(
  () => import("@/components/phone-call-button").then((mod) => mod.PhoneCallButton),
  { ssr: false },
)

const WhatsAppButton = dynamic(
  () => import("@/components/whatsapp-button").then((mod) => mod.WhatsAppButton),
  { ssr: false },
)

const AnalyticsPageView = dynamic(
  () => import("@/components/analytics-page-view").then((mod) => mod.AnalyticsPageView),
  { ssr: false },
)

/**
 * Ana layout'ta ilk boyamayı geciktirmeyen, istemcide lazy yüklenen widget'ları render eder.
 */
export function DeferredLayoutWidgets() {
  return (
    <>
      <AnalyticsPageView />
      <CartSidebar />
      <PhoneCallButton />
      <WhatsAppButton />
    </>
  )
}
