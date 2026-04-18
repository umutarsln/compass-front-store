"use client"

import { MessageCircle } from "lucide-react"
import { gtmWhatsAppClick } from "@/lib/gtm"

/**
 * Sabit WhatsApp FAB; "Bize ulasin" metni tum ekran boyutlarinda surekli gorunur.
 */
export function WhatsAppButton() {
  const phoneNumber = "905534678607"
  const message = "Bilgi almak istiyorum"
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => gtmWhatsAppClick(phoneNumber)}
      aria-label="Bize ulasin — WhatsApp ile yazin"
      className="fixed bottom-6 right-6 z-50 flex max-w-[calc(100vw-3rem)] items-stretch overflow-hidden rounded-full bg-[hsl(142,70%,45%)] text-white shadow-elevated ring-2 ring-white/25 transition-[box-shadow,transform] duration-300 hover:shadow-[0_8px_30px_rgba(34,197,94,0.45)] hover:ring-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] motion-safe:hover:-translate-y-0.5"
    >
      <span
        className="flex items-center pl-4 pr-1 text-sm font-semibold tracking-tight whitespace-nowrap"
        aria-hidden
      >
        Bize ulaşın
      </span>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center" aria-hidden>
        <MessageCircle className="h-7 w-7" strokeWidth={2} />
      </span>
    </a>
  )
}
