import { HeroSection } from "@/components/home/hero-section"
import { DiscountCountdown } from "@/components/home/discount-countdown"
import { CategoriesSection } from "@/components/home/categories-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { LifestyleSection } from "@/components/home/lifestyle-section"
import { TrustSection } from "@/components/home/trust-section"
import { InstagramSection } from "@/components/home/instagram-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <DiscountCountdown />
      <CategoriesSection />
      <HowItWorksSection />
      <LifestyleSection />
      <TrustSection />
      <InstagramSection />
      <CTASection />
    </main>
  )
}
