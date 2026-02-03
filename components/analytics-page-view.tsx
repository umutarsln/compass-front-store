"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackEvent } from "@/lib/analytics"

/**
 * Maps app pathname to analytics page slug (plan: home, category/:slug, product/:slug, cart, checkout).
 */
function pathnameToPage(pathname: string): string {
  if (!pathname || pathname === "/") return "home"
  if (pathname === "/sepet") return "cart"
  if (pathname.startsWith("/odeme") || pathname === "/odeme-auth") return "checkout"
  if (pathname.startsWith("/urun/")) return `product/${pathname.replace("/urun/", "")}`
  if (pathname.startsWith("/urunler")) return "category/urunler"
  if (pathname.startsWith("/favoriler")) return "favoriler"
  // Diğer sayfalar: path'i temiz slug olarak kullan (başta / yok)
  return pathname.replace(/^\//, "") || "home"
}

/**
 * Tracks PAGE_VIEW on route change. Renders nothing.
 */
export function AnalyticsPageView() {
  const pathname = usePathname()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    // Avoid duplicate on first mount vs later navigations
    if (prevPathRef.current === pathname) return
    prevPathRef.current = pathname

    const page = pathnameToPage(pathname)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics][AnalyticsPageView] PAGE_VIEW', { pathname, page })
    }
    trackEvent({ type: "PAGE_VIEW", page })
  }, [pathname])

  return null
}
