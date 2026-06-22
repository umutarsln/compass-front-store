import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { CartSidebar } from "@/components/cart-sidebar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { PhoneCallButton } from "@/components/phone-call-button"
import { AnalyticsPageView } from "@/components/analytics-page-view"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"] })

/** Google Merchant Center alan adı doğrulama kodu (GOOGLE_SITE_VERIFICATION env) */
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION ?? ""

export const metadata: Metadata = {
  title: "Compass Reklam | Endüstriyel Baskı Teknolojileri",
  description: "Endüstriyel baskı teknolojilerinde Türkiye'nin lider çözüm ortağı. UV Baskı, DTF, Lazer Kesim makineleri.",
  generator: 'v0.app',
  icons: {
    icon: '/logos/compass-reklam-logo.png',
    shortcut: '/logos/compass-reklam-logo.png',
    apple: '/logos/compass-reklam-logo.png',
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        {/* Google Site Verification — Merchant Center; doğrulama sonrası kaldırılmamalı */}
        <meta name="google-site-verification" content={googleSiteVerification} />
        {/* Google Tag Manager Compass Reklam by AdresGezgini — ürün listeleme reklamları */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TRHSB7C7');`,
          }}
        />
        {/* Google Tag Manager — HEAD snippet (mümkün olan en üst konum) */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5N8PB529');`,
          }}
        />
        {/* Google Tag (gtag.js) — GA4 G-9WTD6QPS7W doğrudan ölçüm */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9WTD6QPS7W"></script>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-9WTD6QPS7W');`,
          }}
        />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        {/* Google Tag Manager Compass Reklam by AdresGezgini — NOSCRIPT */}
        <noscript>
          <iframe
            src="//www.googletagmanager.com/ns.html?id=GTM-TRHSB7C7"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Google Tag Manager — NOSCRIPT (body açılışından hemen sonra) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5N8PB529"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <AnalyticsPageView />
              <Header />
              {children}
              <CartSidebar />
              <PhoneCallButton />
              <WhatsAppButton />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
