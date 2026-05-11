"use client"

import { MessageCircle } from "lucide-react"
import { gtmWhatsAppClick } from "@/lib/gtm"

const SAHIBINDEN_URL = "https://compassplotter.sahibinden.com/" as const

/**
 * Sağ altta sabit WhatsApp ve sahibinden.com hızlı erişim butonlarını gösterir.
 */
export function WhatsAppButton() {
  const phoneNumber = "905534678607"
  const message = "Bilgi almak istiyorum"
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-[calc(100vw-3rem)] items-center gap-3">
      <a
        href={SAHIBINDEN_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="sahibinden.com mağazamızı açın"
        className="flex items-stretch overflow-hidden rounded-full bg-[#FFE800] text-[#333333] shadow-elevated ring-2 ring-white/25 transition-[box-shadow,transform] duration-300 hover:shadow-[0_8px_30px_rgba(255,232,0,0.45)] hover:ring-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] motion-safe:hover:-translate-y-0.5"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center" aria-hidden>
          <span className="font-sans text-2xl font-black leading-none tracking-tighter">S</span>
        </span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => gtmWhatsAppClick(phoneNumber)}
        aria-label="Bize ulaşın — WhatsApp ile yazın"
        className="flex items-stretch overflow-hidden rounded-full bg-[hsl(142,70%,45%)] text-white shadow-elevated ring-2 ring-white/25 transition-[box-shadow,transform] duration-300 hover:shadow-[0_8px_30px_rgba(34,197,94,0.45)] hover:ring-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] motion-safe:hover:-translate-y-0.5"
      >
        <span
          className="hidden items-center pl-4 pr-1 text-sm font-semibold tracking-tight whitespace-nowrap md:flex"
          aria-hidden
        >
          Bize ulaşın
        </span>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center" aria-hidden>
          <MessageCircle className="h-7 w-7" strokeWidth={2} />
        </span>
      </a>
    </div>
  )
}
