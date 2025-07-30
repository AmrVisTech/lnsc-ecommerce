/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Filter, Grid, List, Star, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearch } from "@/lib/search-context"
import { useCart } from "@/lib/cart-context"
import AdvancedSearch from "@/components/advanced-search"
import SearchFiltersComponent from "@/components/search-filters"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)

  const { searchQuery, setSearchQuery, results, isSearching, filters, addRecentSearch } = useSearch()

  const { addItem } = useCart()

  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query)
      addRecentSearch(query)
    }
  }, [query, searchQuery, setSearchQuery, addRecentSearch])

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      specs: product.specs.slice(0, 3),
      selectedBranch: product.availability[0],
    })
  }

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviews - a.reviews
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category.length > 0) count++
    if (filters.brand.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000) count++
    if (filters.rating > 0) count++
    if (filters.availability.length > 0) count++
    if (filters.features.length > 0) count++
    return count
  }

  const ProductCard = ({ product, index }: { product: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
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
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Available at:</span>
          </div>
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
          <Button variant="outline" className="px-4 bg-transparent" onClick={() => handleAddToCart(product)}>
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="mb-6">
            <AdvancedSearch showFilters />
          </div>

          {query && (
            <div className="mb-4">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Search Results for &quot;{query}&quot;
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isSearching ? "Searching..." : `${results.length} products found`}
              </p>
            </div>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowFilters(true)} className="gap-2 bg-transparent">
                <Filter className="w-4 h-4" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </Button>

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

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        ) : results.length > 0 ? (
          <div
            className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}`}
          >
            {sortedResults.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn&apos;t find any products matching &quot;{query}&quot;. Try adjusting your search or filters.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Suggestions:</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Check your spelling</li>
                <li>• Try more general keywords</li>
                <li>• Remove some filters</li>
                <li>• Browse our categories instead</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💻</div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Start your search</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a search term above to find the perfect laptop for your needs.
            </p>
          </div>
        )}

        {/* Search Filters Modal */}
        <SearchFiltersComponent isOpen={showFilters} onClose={() => setShowFilters(false)} />
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}