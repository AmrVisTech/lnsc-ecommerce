/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Trash2, Grid, List, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWishlist } from "@/lib/wishlist-context"
import { useCart } from "@/lib/cart-context"
import WishlistButton from "@/components/wishlist-button"

export default function WishlistPage() {
  const { items, clearWishlist, getTotalItems } = useWishlist()
  const { addItem } = useCart()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "recent":
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    }
  })

  // Filter items
  const filteredItems = sortedItems.filter((item) => {
    if (filterBy === "all") return true
    if (filterBy === "in-stock") return item.inStock
    if (filterBy === "out-of-stock") return !item.inStock
    return item.category === filterBy
  })

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      specs: [`${item.brand} ${item.model}\`, "Premium Quality\", \"Fast Delivery`],
      selectedBranch: item.availability[0],
    })
  }

  const WishlistItemCard = ({ item, index }: { item: any; index: number }) => (
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
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          width={400}
          height={300}
          className={`w-full object-cover ${viewMode === "list" ? "h-full" : "h-48"}`}
        />
        {item.originalPrice && item.originalPrice > item.price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">SALE</div>
        )}
        {!item.inStock && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-sm font-bold">
            OUT OF STOCK
          </div>
        )}
      </div>

      <div className="p-4 flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">{item.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{item.brand}</p>
            {item.model && <p className="text-gray-500 dark:text-gray-500 text-xs">{item.model}</p>}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900 dark:text-white">₱{item.price.toLocaleString()}</div>
            {item.originalPrice && item.originalPrice > item.price && (
              <div className="text-sm text-gray-500 line-through">₱{item.originalPrice.toLocaleString()}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {item.rating} ({item.reviewCount} reviews)
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available at:</p>
          <div className="flex flex-wrap gap-1">
            {item.availability.slice(0, 3).map((branch: string) => (
              <span
                key={branch}
                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
              >
                {branch}
              </span>
            ))}
            {item.availability.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">+{item.availability.length - 3} more</span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Added {new Date(item.addedAt).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          <Link href={`/product/${item.id}`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
          </Link>
          <Button variant="outline" onClick={() => handleAddToCart(item)} disabled={!item.inStock} className="px-4">
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <WishlistButton
            product={item}
            size="md"
            variant="outline"
            className="px-4 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          />
        </div>
      </div>
    </motion.div>
  )

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist. You can save items for later and keep track of your
              favorites.
            </p>
            <Link href="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} saved for later
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="work">Business</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div
          className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}`}
        >
          {filteredItems.map((item, index) => (
            <WishlistItemCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {filteredItems.length === 0 && items.length > 0 && (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No items match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}