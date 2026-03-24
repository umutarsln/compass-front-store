"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { XCircle, RefreshCw, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("orderId")
  const error = searchParams.get("error")
  const { syncCart } = useCart()

  // Sync cart when page loads (backend will reactivate cart if payment failed)
  useEffect(() => {
    syncCart().catch((error) => {
      console.error("Failed to sync cart:", error)
    })
  }, [syncCart])

  const handleRetry = () => {
    if (orderId) {
      // Ödeme sayfasına geri dön (order ID ile)
      router.push(`/odeme?orderId=${orderId}`)
    } else {
      // Sepete dön
      router.push("/sepet")
    }
  }

  return (
    <>
      <main>
        <section className="py-24 bg-background min-h-screen">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="mb-8">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-12 h-12 text-destructive" />
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">
                  Ödeme İşlemi Başarısız
                </h1>
                <p className="text-muted-foreground text-lg">
                  Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin.
                </p>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 p-6 mb-8 text-left">
                  <p className="text-sm font-medium text-destructive mb-2">Hata Detayı:</p>
                  <p className="text-sm text-muted-foreground">{decodeURIComponent(error)}</p>
                </div>
              )}

              <div className="bg-secondary p-8 mb-8">
                <p className="text-sm text-muted-foreground mb-6">
                  Ödeme işleminiz sırasında bir sorun oluştu. Bu durum genellikle şu nedenlerden kaynaklanabilir:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Kart bilgilerinizde hata olabilir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Kart limitiniz yetersiz olabilir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>İnternet bağlantınızda sorun olabilir</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>Banka tarafında geçici bir sorun olabilir</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Tekrar Dene
                  </button>
                  <Link
                    href="/sepet"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Sepete Dön
                  </Link>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Ana Sayfaya Dön
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <>
        <main>
          <section className="py-24 bg-background min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    }>
      <PaymentFailedContent />
    </Suspense>
  )
}
