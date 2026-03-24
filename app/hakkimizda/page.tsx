import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutStory } from "@/components/about/about-story"
import { AboutValues } from "@/components/about/about-values"
import { AboutTimeline } from "@/components/about/about-timeline"
import { AboutStats } from "@/components/about/about-stats"

export const metadata = {
  title: "Hakkımızda | Compass Reklam",
  description: "Baskı teknolojisinde 15+ yıl tecrübe. Endüstriyel baskı çözümlerinde Türkiye'nin güvenilir iş ortağı.",
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
