import { Footer } from "@/components/footer"
import { FavoritesContent } from "@/components/favorites-content"

export const metadata = {
  title: "Favorilerim | compass",
  description: "Favorilerinize eklediğiniz ürünleri görüntüleyin",
}

export default function FavoritesPage() {
  return (
    <>
      <main>
        <FavoritesContent />
      </main>
      <Footer />
    </>
  )
}
