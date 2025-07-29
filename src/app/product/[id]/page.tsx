import ProductDetailClient from "@/components/product-detail-client"

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient id={params.id} />
}