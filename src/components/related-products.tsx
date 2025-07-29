/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface RelatedProductsProps {
  currentProductId: number
  category: string
}

// Mock related products data
const getRelatedProducts = (currentId: number, category: string) => {
  const allProducts = [
    {
      id: 2,
      name: "Business Elite",
      brand: "Lenovo",
      price: 65999,
      originalPrice: 69999,
      image: "/placeholder.svg?height=300&width=400&text=Business+Laptop",
      rating: 4.6,
      reviews: 89,
      category: "work",
      specs: ["Intel i7", "16GB RAM", "512GB SSD"],
    },
    {
      id: 3,
      name: "Student Essential",
      brand: "Acer",
      price: 35999,
      originalPrice: 39999,
      image: "/placeholder.svg?height=300&width=400&text=Student+Laptop",
      rating: 4.4,
      reviews: 156,
      category: "student",
      specs: ["Intel i5", "8GB RAM", "256GB SSD"],
    },
    {
      id: 4,
      name: "Budget Champion",
      brand: "HP",
      price: 25999,
      originalPrice: 28999,
      image: "/placeholder.svg?height=300&width=400&text=Budget+Laptop",
      rating: 4.2,
      reviews: 203,
      category: "budget",
      specs: ["AMD Ryzen 5", "8GB RAM", "256GB SSD"],
    },
    {
      id: 5,
      name: "Gaming Pro Max",
      brand: "MSI",
      price: 95999,
      originalPrice: 105999,
      image: "/placeholder.svg?height=300&width=400&text=Gaming+Laptop+Pro",
      rating: 4.9,
      reviews: 78,
      category: "gaming",
      specs: ["RTX 4080", "32GB RAM", "2TB SSD"],
    },
  ]

  return allProducts.filter((product) => product.id !== currentId).slice(0, 4)
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const { addItem } = useCart()
  const relatedProducts = getRelatedProducts(currentProductId, category)

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      specs: product.specs,
    })
  }

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          You Might Also Like
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Discover more premium laptops from our collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.originalPrice > product.price && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  SALE
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white truncate">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{product.brand}</p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    ₱{product.price.toLocaleString()}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-sm text-gray-500 line-through">₱{product.originalPrice.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/product/${product.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent text-sm">
                    View Details
                  </Button>
                </Link>
                <Button
                  size="icon"
                  onClick={() => handleAddToCart(product)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}