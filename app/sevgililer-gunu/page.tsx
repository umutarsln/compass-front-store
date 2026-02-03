import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ValentineHero } from "@/components/valentine/valentine-hero"
import { ValentineProducts } from "@/components/valentine/valentine-products"
import { ValentineFeatures } from "@/components/valentine/valentine-features"

export const metadata = {
  title: "Sevgililer Günü Özel | Shawk",
  description:
    "Sevgililer Günü için en anlamlı hediye. Fotoğraflarınızdan kişiselleştirilmiş LED lambalar ile aşkınızı ışığa dönüştürün.",
}

export default function ValentinesPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <ValentineHero />
        <ValentineFeatures />
        {/* <ValentineProducts /> */}
      </main>
      <Footer />
    </>
  )
}
