import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoriesGrid } from "@/components/categories-grid"

export const metadata = {
  title: "Kategoriler | Shawk",
  description:
    "Tüm kategorilerimizi keşfedin. Sevgiliye özel, isim & harf, takım & sembol, film & dizi ve özel günler.",
}

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <CategoriesGrid />
      </main>
      <Footer />
    </>
  )
}
