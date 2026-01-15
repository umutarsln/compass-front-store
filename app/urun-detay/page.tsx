import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetailPage } from "@/components/product-detail-page"

export const metadata = {
  title: "Ürün Detay | Shawk",
  description: "Ürün detay sayfası",
}

export default function UrunDetayPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <ProductDetailPage />
      </main>
      <Footer />
    </>
  )
}
