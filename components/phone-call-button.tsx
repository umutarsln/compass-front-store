"use client"

import { Phone } from "lucide-react"
import { SITE_PHONE_DISPLAY, SITE_PHONE_TEL_HREF } from "@/lib/contact-content"
import { gtmPhoneCallClick } from "@/lib/gtm"
import { cn } from "@/lib/utils"

/**
 * Sol altta sabit `tel:` FAB: mobilde yalnızca ikon; md ve üzerinde “Bizi arayın” metni gösterilir.
 */
export function PhoneCallButton() {
  return (
    <a
      href={SITE_PHONE_TEL_HREF}
      onClick={() => gtmPhoneCallClick(SITE_PHONE_DISPLAY)}
      className={cn(
        "group fixed bottom-6 left-6 z-50 flex max-w-[calc(100vw-3rem)] items-stretch overflow-hidden rounded-full bg-[hsl(217,82%,52%)] text-white shadow-elevated ring-2 ring-white/25 transition-[box-shadow,transform] duration-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.45)] hover:ring-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] motion-safe:hover:md:-translate-y-0.5",
      )}
      aria-label={`Bizi arayın — ${SITE_PHONE_DISPLAY}`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center" aria-hidden>
        <Phone className="h-7 w-7" strokeWidth={2} />
      </span>
      <span
        className="hidden items-center pl-1 pr-4 text-sm font-semibold tracking-tight whitespace-nowrap md:flex"
        aria-hidden
      >
        Bizi arayın
      </span>
    </a>
  )
}
