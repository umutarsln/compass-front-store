"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useAuth } from "@/contexts/auth-context"
import { LogIn, ShoppingBag, ArrowRight } from "lucide-react"

export default function CheckoutAuthPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  // Eğer zaten giriş yapılmışsa ödeme sayfasına yönlendir
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/odeme")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) {
    return null
  }

  return (
    <>
      <main>
        <section className="py-12 sm:py-24 bg-background min-h-screen overflow-x-hidden">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4 sm:mb-6" />
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                Ödeme İşlemine Devam Etmek İçin
              </h1>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
                Hesabınıza giriş yaparak siparişinizi tamamlayabilir veya üye olmadan devam edebilirsiniz.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Giriş Yap Butonu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Link
                    href="/giris?redirect=/odeme"
                    className="block p-4 sm:p-6 border-2 border-border bg-background hover:border-foreground transition-all group h-full"
                  >
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <LogIn className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <h2 className="font-display text-base sm:text-lg font-semibold text-foreground">Giriş Yap</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground text-center">
                        Hesabınıza giriş yaparak siparişinizi tamamlayın
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-primary font-medium text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                        <span>Giriş Yap</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* Üye Olmadan Devam Et Butonu */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Link
                    href="/odeme"
                    className="block p-4 sm:p-6 border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all group h-full"
                  >
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-primary-foreground/30 transition-colors">
                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                      </div>
                      <h2 className="font-display text-base sm:text-lg font-semibold">Üye Olmadan Devam Et</h2>
                      <p className="text-xs sm:text-sm text-primary-foreground/80 text-center">
                        Hesap oluşturmadan siparişinizi tamamlayın
                      </p>
                      <div className="flex items-center gap-1.5 sm:gap-2 font-medium text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                        <span>Devam Et</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Hesabınız yok mu?{" "}
                  <Link href="/kayit?redirect=/odeme" className="text-primary hover:underline font-medium">
                    Üye Ol
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
