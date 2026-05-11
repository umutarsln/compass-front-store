import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"
import { AboutValues } from "@/components/about/about-values"
import { AboutTimeline } from "@/components/about/about-timeline"
import { AboutStats } from "@/components/about/about-stats"

export const metadata = {
  title: "Hakkımızda | Compass Reklam",
  description:
    "2018'den beri endüstriyel baskıda güvenilir çözüm ortağınız. 3000+ makine kurulumu, Türkiye geneli teknik servis ve satış sonrası tam destek.",
}

export default function AboutPage() {
  return (
    <>
      <main>
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutTimeline />
        <AboutStats />
      </main>
      <Footer />
    </>
  )
}
