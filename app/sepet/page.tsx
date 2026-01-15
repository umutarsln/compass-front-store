import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart-content"

export const metadata = {
  title: "Sepetim | Shawk",
  description: "Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.",
}

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <CartContent />
      </main>
      <Footer />
    </>
  )
}
