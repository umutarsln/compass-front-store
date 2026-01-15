import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoritesContent } from "@/components/favorites-content"

export const metadata = {
  title: "Favorilerim | Shawk",
  description: "Favorilerinize eklediğiniz ürünleri görüntüleyin",
}

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <FavoritesContent />
      </main>
      <Footer />
    </>
  )
}
