import { Metadata } from 'next'
import ProductDetailClient from "@/components/product-detail-client"

export const metadata: Metadata = {
  title: 'Product Details'
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductDetailClient params={{ id }} />
}