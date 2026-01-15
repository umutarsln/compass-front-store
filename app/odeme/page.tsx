import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata = {
  title: "Güvenli Ödeme | Shawk",
  description: "Siparişinizi güvenle tamamlayın.",
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <CheckoutForm />
      </main>
      <Footer />
    </>
  )
}
