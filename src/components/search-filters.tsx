"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Filter, X, Star, MapPin, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useSearch, type SearchFilters } from "@/lib/search-context"

interface SearchFiltersProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchFiltersComponent({ isOpen, onClose }: SearchFiltersProps) {
  const { filters, setFilters } = useSearch()
  const [tempFilters, setTempFilters] = useState<SearchFilters>(filters)

  const categories = [
    { id: "gaming", label: "Gaming", count: 15 },
    { id: "work", label: "Business", count: 23 },
    { id: "student", label: "Student", count: 18 },
    { id: "budget", label: "Budget", count: 12 },
  ]

  const brands = [
    { id: "ASUS", label: "ASUS", count: 8 },
    { id: "Lenovo", label: "Lenovo", count: 12 },
    { id: "HP", label: "HP", count: 10 },
    { id: "Dell", label: "Dell", count: 7 },
    { id: "Acer", label: "Acer", count: 9 },
    { id: "MSI", label: "MSI", count: 6 },
  ]

  const branches = [
    { id: "Zamboanga", label: "Zamboanga City" },
    { id: "Davao", label: "Davao City" },
    { id: "CDO", label: "Cagayan de Oro" },
    { id: "Butuan", label: "Butuan City" },
  ]

  const features = [
    { id: "RGB Keyboard", label: "RGB Keyboard" },
    { id: "144Hz Display", label: "144Hz Display" },
    { id: "Ray Tracing", label: "Ray Tracing" },
    { id: "DLSS", label: "DLSS" },
    { id: "Wi-Fi 6", label: "Wi-Fi 6" },
    { id: "Fingerprint Scanner", label: "Fingerprint Scanner" },
    { id: "Backlit Keyboard", label: "Backlit Keyboard" },
    { id: "Long Battery Life", label: "Long Battery Life" },
    { id: "Lightweight", label: "Lightweight" },
    { id: "4K Display", label: "4K Display" },
    { id: "Thunderbolt", label: "Thunderbolt" },
    { id: "Fast Charging", label: "Fast Charging" },
  ]

  const handleFilterChange = (filterType: keyof SearchFilters, value: unknown) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleArrayFilterToggle = (filterType: keyof SearchFilters, value: string) => {
    const currentArray = tempFilters[filterType] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]

    handleFilterChange(filterType, newArray)
  }

  const applyFilters = () => {
    setFilters(tempFilters)
    onClose()
  }

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      category: [],
      brand: [],
      priceRange: [0, 200000],
      rating: 0,
      availability: [],
      features: [],
    }
    setTempFilters(defaultFilters)
    setFilters(defaultFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (tempFilters.category.length > 0) count++
    if (tempFilters.brand.length > 0) count++
    if (tempFilters.priceRange[0] > 0 || tempFilters.priceRange[1] < 200000) count++
    if (tempFilters.rating > 0) count++
    if (tempFilters.availability.length > 0) count++
    if (tempFilters.features.length > 0) count++
    return count
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Search Filters</h2>
            {getActiveFilterCount() > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                {getActiveFilterCount()} active
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Category</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={tempFilters.category.includes(category.id)}
                      onCheckedChange={() => handleArrayFilterToggle("category", category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="flex-1 cursor-pointer">
                      <span>{category.label}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({category.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Brand</h3>
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={tempFilters.brand.includes(brand.id)}
                      onCheckedChange={() => handleArrayFilterToggle("brand", brand.id)}
                    />
                    <Label htmlFor={`brand-${brand.id}`} className="flex-1 cursor-pointer">
                      <span>{brand.label}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">({brand.count})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
              <div className="space-y-4">
                <Slider
                  value={tempFilters.priceRange}
                  onValueChange={(value: [number, number]) => handleFilterChange("priceRange", value as [number, number])}
                  max={200000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>₱{tempFilters.priceRange[0].toLocaleString()}</span>
                  <span>₱{tempFilters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Minimum Rating</h3>
              <div className="space-y-3">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange("rating", tempFilters.rating === rating ? 0 : rating)}
                    className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
                      tempFilters.rating === rating
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">& up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Available at
              </h3>
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div key={branch.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`branch-${branch.id}`}
                      checked={tempFilters.availability.includes(branch.id)}
                      onCheckedChange={() => handleArrayFilterToggle("availability", branch.id)}
                    />
                    <Label htmlFor={`branch-${branch.id}`} className="cursor-pointer">
                      {branch.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Features
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={tempFilters.features.includes(feature.id)}
                      onCheckedChange={() => handleArrayFilterToggle("features", feature.id)}
                    />
                    <Label htmlFor={`feature-${feature.id}`} className="cursor-pointer text-sm">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={resetFilters} className="bg-transparent">
            Reset All
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
              Apply Filters ({getActiveFilterCount()})
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}