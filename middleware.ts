import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { buildContentSecurityPolicy } from "@/lib/csp-config"

/**
 * Güvenlik başlıklarını tüm sayfa yanıtlarına ekler.
 */
export function middleware(_request: NextRequest) {
  const response = NextResponse.next()
  const isDev = process.env.NODE_ENV === "development"

  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  response.headers.set("Cross-Origin-Resource-Policy", "same-site")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  )
  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy(isDev))

  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    )
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
