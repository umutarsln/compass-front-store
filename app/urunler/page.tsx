import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AllProducts } from "@/components/all-products"

export const metadata = {
  title: "Tüm Ürünler | Shawk",
  description: "Kişiselleştirilmiş 3D LED lambalarımızın tamamını keşfedin.",
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <AllProducts />
      </main>
      <Footer />
    </>
  )
}
