"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, MapPin, Shield, Truck, Award, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { useComparison } from "@/lib/comparison-context"
import ImageCarousel from "@/components/image-carousel"
import ProductSpecs from "@/components/product-specs"
import ProductReviews from "@/components/product-reviews"
import RelatedProducts from "@/components/related-products"

// Mock product data - in real app, this would come from API
const getProductById = (id: string) => {
  const products = {
    "1": {
      id: 1,
      name: "Gaming Beast Pro",
      brand: "ASUS",
      model: "ROG Strix G15",
      price: 89999,
      originalPrice: 99999,
      images: [
        "/placeholder.svg?height=600&width=800&text=Gaming+Laptop+Front",
        "/placeholder.svg?height=600&width=800&text=Gaming+Laptop+Side",
        "/placeholder.svg?height=600&width=800&text=Gaming+Laptop+Back",
        "/placeholder.svg?height=600&width=800&text=Gaming+Laptop+Keyboard",
        "/placeholder.svg?height=600&width=800&text=Gaming+Laptop+Ports",
      ],
      rating: 4.8,
      reviewCount: 124,
      category: "gaming",
      availability: ["Zamboanga", "Davao", "CDO"],
      inStock: true,
      stockCount: 15,
      description:
        "Unleash your gaming potential with the ASUS ROG Strix G15. Featuring the latest RTX 4070 graphics card and Intel Core i7 processor, this gaming powerhouse delivers exceptional performance for the most demanding games and creative tasks.",
      keyFeatures: [
        "NVIDIA GeForce RTX 4070 8GB GDDR6",
        "Intel Core i7-13700H Processor",
        "16GB DDR5 RAM (Expandable to 32GB)",
        "1TB PCIe 4.0 NVMe SSD",
        '15.6" FHD 144Hz IPS Display',
        "RGB Backlit Keyboard",
        "Advanced Cooling System",
        "Wi-Fi 6E & Bluetooth 5.3",
      ],
      specs: {
        processor: {
          brand: "Intel",
          model: "Core i7-13700H",
          cores: "14 cores (6P + 8E)",
          baseSpeed: "2.4 GHz",
          maxSpeed: "5.0 GHz",
          cache: "24MB L3 Cache",
        },
        graphics: {
          gpu: "NVIDIA GeForce RTX 4070",
          vram: "8GB GDDR6",
          rayTracing: "Yes",
          dlss: "DLSS 3.0",
        },
        memory: {
          ram: "16GB DDR5-4800",
          maxRam: "32GB",
          slots: "2 x SO-DIMM",
        },
        storage: {
          primary: "1TB PCIe 4.0 NVMe SSD",
          slots: "2 x M.2 slots",
          expandable: "Up to 2TB",
        },
        display: {
          size: "15.6 inches",
          resolution: "1920 x 1080 (FHD)",
          refreshRate: "144Hz",
          panel: "IPS",
          colorGamut: "100% sRGB",
          brightness: "300 nits",
        },
        connectivity: {
          wifi: "Wi-Fi 6E (802.11ax)",
          bluetooth: "Bluetooth 5.3",
          ethernet: "Gigabit Ethernet",
          usb: "3x USB 3.2, 1x USB-C Thunderbolt 4",
          hdmi: "HDMI 2.1",
          audio: "3.5mm combo jack",
        },
        physical: {
          dimensions: "354 x 259 x 22.9 mm",
          weight: "2.3 kg",
          battery: "90Wh Li-ion",
          adapter: "240W AC Adapter",
          keyboard: "RGB Backlit",
          trackpad: "Precision Touchpad",
        },
      },
      features: ["RGB Keyboard", "144Hz Display", "Ray Tracing", "DLSS", "Wi-Fi 6", "Fast Charging", "Gaming Mode"],
      warranty: "2 years international warranty",
      reviews: [
        {
          id: 1,
          user: "GamerPro2024",
          rating: 5,
          date: "2024-01-15",
          title: "Incredible Gaming Performance!",
          comment:
            "This laptop exceeded my expectations. Running Cyberpunk 2077 at ultra settings with RTX on and getting 80+ FPS. The cooling system is excellent - never gets too hot even during long gaming sessions.",
          helpful: 23,
          verified: true,
        },
        {
          id: 2,
          user: "TechReviewer",
          rating: 4,
          date: "2024-01-10",
          title: "Great for Content Creation",
          comment:
            "Perfect for video editing and 3D rendering. The RTX 4070 handles everything I throw at it. Only minor complaint is the battery life during heavy workloads, but that's expected for a gaming laptop.",
          helpful: 18,
          verified: true,
        },
        {
          id: 3,
          user: "StudentGamer",
          rating: 5,
          date: "2024-01-05",
          title: "Best Purchase Ever!",
          comment:
            "Bought this from LNSC Davao branch. Excellent customer service and the laptop is amazing. The 144Hz display is so smooth for competitive gaming. Highly recommend!",
          helpful: 15,
          verified: true,
        },
      ],
    },
    // Add more products as needed
  }

  return products[id as keyof typeof products] || null
}

export default function ProductDetailClient({ id }: { id: string }) {
  const [selectedBranch, setSelectedBranch] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const { addItem } = useCart()
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()

  const product = getProductById(id)

  useEffect(() => {
    if (product && product.availability.length > 0) {
      setSelectedBranch(product.availability[0])
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
          <Link href="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Back to Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      specs: product.keyFeatures.slice(0, 3),
      selectedBranch,
    })
  }

  const handleComparisonToggle = () => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id)
    } else {
      addToComparison({
        id: product.id,
        name: product.name,
        brand: product.brand,
        model: product.model,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        rating: product.rating,
        reviewCount: product.reviewCount,
        category: product.category,
        availability: product.availability,
        specs: product.specs,
        features: product.features,
        keyFeatures: product.keyFeatures,
      })
    }
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-blue-600">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/shop" className="text-gray-500 hover:text-blue-600">
            Shop
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/shop">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image Carousel */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <ImageCarousel images={product.images} productName={product.name} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    In Stock ({product.stockCount} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-4">{product.model}</p>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">₱{product.price.toLocaleString()}</div>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <div className="text-xl text-gray-500 line-through">₱{product.originalPrice.toLocaleString()}</div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Save {discountPercentage}%
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>

            {/* Key Features */}
            <div>
              <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-3">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.keyFeatures.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Branch Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Available at branches:
              </Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {product.availability.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {branch}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-4 ${isWishlisted ? "text-red-500 border-red-500" : ""}`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="outline"
                onClick={handleComparisonToggle}
                className={`px-4 ${isInComparison(product.id) ? "text-blue-500 border-blue-500" : ""}`}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>

              <Button variant="outline" className="px-4 bg-transparent">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600 dark:text-gray-400">2 Year Warranty</div>
              </div>
              <div className="text-center">
                <Truck className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600 dark:text-gray-400">Free Delivery</div>
              </div>
              <div className="text-center">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600 dark:text-gray-400">Authorized Dealer</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Information Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">Product Overview</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{product.description}</p>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What&apos;s in the Box:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    <li>{product.name} Laptop</li>
                    <li>240W AC Power Adapter</li>
                    <li>Power Cord</li>
                    <li>Quick Start Guide</li>
                    <li>Warranty Card</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-6">
              <ProductSpecs specs={product.specs} />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ProductReviews reviews={product.reviews} rating={product.rating} reviewCount={product.reviewCount} />
            </TabsContent>

          </Tabs>
        </motion.div>

        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </div>
  )
}
