import HeroSection from "@/components/hero-section";
import ProductCategories from "@/components/product-categories"
import BranchLocator from "@/components/branch-locator"
import CompanyTimeline from "@/components/company-timeline"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <BranchLocator />
      <CompanyTimeline />
      <Footer />
    </>
  )
}