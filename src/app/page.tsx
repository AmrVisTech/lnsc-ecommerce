import HeroSection from "@/components/hero-section";
import ProductCategories from "@/components/product-categories"
import BranchLocator from "@/components/branch-locator"
import CompanyTimeline from "@/components/company-timeline"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <BranchLocator />
      <CompanyTimeline />
    </>
  )
}