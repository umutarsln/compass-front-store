import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetailKisiyeOzel } from "@/components/product-detail-kisiye-ozel"

export const metadata = {
  title: "Ürün Detay - Kişiye Özel | Shawk",
  description: "Kişiye özel tasarım ürün detay sayfası",
}

export default function UrunDetayKisiyeOzelPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <ProductDetailKisiyeOzel />
      </main>
      <Footer />
    </>
  )
}
