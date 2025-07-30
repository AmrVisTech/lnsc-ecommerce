/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Search, Grid, List, Star, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { useComparison } from "@/lib/comparison-context"
import WishlistButton from "@/components/wishlist-button"

// Mock product data
const products = [
  {
    id: 1,
    name: "Gaming Beast Pro",
    brand: "ASUS",
    model: "ROG Strix G15",
    price: 89999,
    originalPrice: 99999,
    image: "/placeholder.svg?height=300&width=400&text=Gaming+Laptop",
    rating: 4.8,
    reviews: 124,
    category: "gaming",
    specs: ["RTX 4070", "16GB RAM", "1TB SSD"],
    availability: ["Zamboanga", "Davao", "CDO"],
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
    features: ["RGB Keyboard", "144Hz Display", "Ray Tracing", "DLSS", "Wi-Fi 6", "Fast Charging", "Gaming Mode"],
    fullSpecs: {
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
  },
  {
    id: 2,
    name: "Business Elite",
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon",
    price: 65999,
    originalPrice: 69999,
    image: "/placeholder.svg?height=300&width=400&text=Business+Laptop",
    rating: 4.6,
    reviews: 89,
    category: "work",
    specs: ["Intel i7", "16GB RAM", "512GB SSD"],
    availability: ["Davao", "CDO", "Butuan"],
    keyFeatures: [
      "Intel Core i7-13700U Processor",
      "16GB LPDDR5 RAM",
      "512GB PCIe 4.0 NVMe SSD",
      '14" WUXGA IPS Display',
      "Fingerprint Scanner",
      "Backlit Keyboard",
      "Long Battery Life",
      "Wi-Fi 6E & Bluetooth 5.1",
    ],
    features: ["Fingerprint Scanner", "Backlit Keyboard", "Long Battery Life", "Lightweight", "Fast Charging"],
    fullSpecs: {
      processor: {
        brand: "Intel",
        model: "Core i7-13700U",
        cores: "10 cores (2P + 8E)",
        baseSpeed: "1.8 GHz",
        maxSpeed: "4.8 GHz",
        cache: "12MB L3 Cache",
      },
      graphics: {
        gpu: "Intel Iris Xe Graphics",
        vram: "Shared System Memory",
        rayTracing: "No",
        dlss: "No",
      },
      memory: {
        ram: "16GB LPDDR5-5200",
        maxRam: "16GB (Soldered)",
        slots: "Soldered",
      },
      storage: {
        primary: "512GB PCIe 4.0 NVMe SSD",
        slots: "1 x M.2 slot",
        expandable: "Up to 2TB",
      },
      display: {
        size: "14 inches",
        resolution: "1920 x 1200 (WUXGA)",
        refreshRate: "60Hz",
        panel: "IPS",
        colorGamut: "100% sRGB",
        brightness: "400 nits",
      },
      connectivity: {
        wifi: "Wi-Fi 6E (802.11ax)",
        bluetooth: "Bluetooth 5.1",
        ethernet: "Via USB-C adapter",
        usb: "2x USB-C Thunderbolt 4, 2x USB 3.2",
        hdmi: "HDMI 2.0",
        audio: "3.5mm combo jack",
      },
      physical: {
        dimensions: "315 x 222 x 15.4 mm",
        weight: "1.12 kg",
        battery: "57Wh Li-ion",
        adapter: "65W USB-C Adapter",
        keyboard: "Backlit ThinkPad Keyboard",
        trackpad: "Glass Precision Touchpad",
      },
    },
  },
  // Add more products with full specs...
]

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [filteredProducts, setFilteredProducts] = useState(products)

  const { addItem } = useCart()
  const { addToComparison, removeFromComparison, isInComparison } = useComparison()

  useEffect(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // Keep original order for relevance
        break
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, sortBy])

  const handleComparisonToggle = (product: any) => {
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
        image: product.image,
        rating: product.rating,
        reviewCount: product.reviews,
        category: product.category,
        availability: product.availability,
        specs: product.fullSpecs,
        features: product.features,
        keyFeatures: product.keyFeatures,
      })
    }
  }

  const ProductCard = ({ product, index }: { product: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className={`w-full object-cover ${viewMode === "list" ? "h-full" : "h-48"}`}
        />
        {product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">SALE</div>
        )}
      </div>

      <div className="p-4 flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{product.brand}</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900 dark:text-white">₱{product.price.toLocaleString()}</div>
            {product.originalPrice > product.price && (
              <div className="text-sm text-gray-500 line-through">₱{product.originalPrice.toLocaleString()}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.specs.map((spec: string) => (
            <span
              key={spec}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available at:</p>
          <div className="flex flex-wrap gap-1">
            {product.availability.map((branch: string) => (
              <span
                key={branch}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
          </Link>
          <Button
            variant="outline"
            className="px-4 bg-transparent"
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                specs: product.specs,
                selectedBranch: product.availability[0], // Default to first available branch
              })
            }
          >
            Add to Cart
          </Button>
          <WishlistButton
            product={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              model: product.model,
              price: product.price,
              originalPrice: product.originalPrice,
              image: product.image,
              rating: product.rating,
              reviews: product.reviews,
              category: product.category,
              availability: product.availability,
              inStock: true,
            }}
            size="md"
            variant="outline"
          />
          <Button
            variant="outline"
            onClick={() => handleComparisonToggle(product)}
            className={`px-4 ${isInComparison(product.id) ? "text-blue-500 border-blue-500" : "bg-transparent"}`}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop Laptops</h1>
          <p className="text-gray-600 dark:text-gray-400">Discover our premium collection of laptops for every need</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search laptops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="work">Business</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid/List */}
        <div
          className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}`}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}