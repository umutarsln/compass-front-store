import { Footer } from "@/components/footer"
import { CartContent } from "@/components/cart-content"

export const metadata = {
  title: "Sepetim | compass",
  description: "Sepetinizdeki ürünleri görüntüleyin ve siparişinizi tamamlayın.",
}

export default function CartPage() {
  return (
    <>
      <main>
        <CartContent />
      </main>
      <Footer />
    </>
  )
}
