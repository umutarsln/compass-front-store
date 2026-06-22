import { NextResponse } from "next/server"
import { buildGoogleShoppingFeedXml } from "@/lib/google-shopping-feed"

/** Feed her saat yeniden üretilir. */
export const revalidate = 3600

/**
 * Google Merchant Center ürün feed'ini RSS/XML olarak sunar.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const xml = await buildGoogleShoppingFeedXml()

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("[google-shopping-feed] XML üretilemedi:", error)

    return NextResponse.json(
      { message: "Google Shopping feed oluşturulamadı." },
      { status: 500 },
    )
  }
}
