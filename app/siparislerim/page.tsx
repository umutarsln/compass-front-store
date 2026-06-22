import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { Footer } from "@/components/footer"
import { MyOrdersContent } from "@/components/my-orders-content"

export const metadata = {
  title: "Alışverişlerim | Compass Reklam",
  description: "Sipariş geçmişinizi görüntüleyin ve başarı linklerinize ulaşın.",
}

/**
 * Giriş yapmış kullanıcının sipariş geçmişi sayfası.
 */
export default function MyOrdersPage() {
  return (
    <>
      <main>
        <Suspense
          fallback={
            <section className="py-24 bg-background min-h-screen">
              <div className="mx-auto max-w-5xl px-6 lg:px-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </section>
          }
        >
          <MyOrdersContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
