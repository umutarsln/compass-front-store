import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"
import { AboutValues } from "@/components/about/about-values"
import { AboutProcess } from "@/components/about/about-process"
// import { AboutTeam } from "@/components/about/about-team"

export const metadata = {
  title: "Hakkımızda | Shawk",
  description: "Shawk olarak anılarınızı ışığa dönüştürüyoruz. Hikayemizi ve değerlerimizi keşfedin.",
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-26 md:pt-[108px]">
        <AboutHero />
        <AboutStory />
        {/* <AboutTeam /> */}
        <AboutValues />
        <AboutProcess />
      </main>
      <Footer />
    </>
  )
}
