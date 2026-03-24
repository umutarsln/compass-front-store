import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata = {
  title: "Güvenli Ödeme | Shawk",
  description: "Siparişinizi güvenle tamamlayın.",
}

export default function CheckoutPage() {
  return (
    <>
      <main>
        <CheckoutForm />
      </main>
      <Footer />
    </>
  )
}
