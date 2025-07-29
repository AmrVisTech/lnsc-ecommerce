"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface SearchFilters {
  category: string[]
  brand: string[]
  priceRange: [number, number]
  rating: number
  availability: string[]
  features: string[]
}

export interface SearchResult {
  id: number
  name: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  specs: string[]
  availability: string[]
  features: string[]
}

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void
  results: SearchResult[]
  suggestions: string[]
  isSearching: boolean
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
}

const defaultFilters: SearchFilters = {
  category: [],
  brand: [],
  priceRange: [0, 200000],
  rating: 0,
  availability: [],
  features: [],
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

// Mock product data for search
const mockProducts: SearchResult[] = [
  {
    id: 1,
    name: "Gaming Beast Pro",
    brand: "ASUS",
    price: 89999,
    originalPrice: 99999,
    image: "/placeholder.svg?height=300&width=400&text=Gaming+Laptop",
    rating: 4.8,
    reviews: 124,
    category: "gaming",
    specs: ["RTX 4070", "16GB RAM", "1TB SSD"],
    availability: ["Zamboanga", "Davao", "CDO"],
    features: ["RGB Keyboard", "144Hz Display", "Ray Tracing", "DLSS", "Wi-Fi 6"],
  },
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
    availability: ["Davao", "CDO", "Butuan"],
    features: ["Fingerprint Scanner", "Backlit Keyboard", "Long Battery Life", "Lightweight"],
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
    availability: ["Zamboanga", "Davao", "CDO", "Butuan"],
    features: ["Lightweight", "Long Battery Life", "Fast Charging", "Webcam"],
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
    availability: ["Zamboanga", "Davao"],
    features: ["Fast Boot", "Webcam", "Wi-Fi 6", "USB-C"],
  },
  {
    id: 5,
    name: "Creative Pro",
    brand: "Dell",
    price: 75999,
    originalPrice: 82999,
    image: "/placeholder.svg?height=300&width=400&text=Creative+Laptop",
    rating: 4.7,
    reviews: 67,
    category: "work",
    specs: ["Intel i7", "32GB RAM", "1TB SSD"],
    availability: ["Davao", "CDO"],
    features: ["4K Display", "Color Accurate", "Stylus Support", "Thunderbolt"],
  },
  {
    id: 6,
    name: "Gaming Starter",
    brand: "MSI",
    price: 55999,
    originalPrice: 59999,
    image: "/placeholder.svg?height=300&width=400&text=Gaming+Starter",
    rating: 4.3,
    reviews: 98,
    category: "gaming",
    specs: ["GTX 1660", "16GB RAM", "512GB SSD"],
    availability: ["Zamboanga", "CDO", "Butuan"],
    features: ["RGB Keyboard", "120Hz Display", "Gaming Mode", "Cooling System"],
  },
]

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("lnsc-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Generate suggestions based on query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const query = searchQuery.toLowerCase()
      const productSuggestions = mockProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.specs.some((spec) => spec.toLowerCase().includes(query)) ||
            product.features.some((feature) => feature.toLowerCase().includes(query)),
        )
        .map((product) => product.name)
        .slice(0, 5)

      const brandSuggestions = Array.from(new Set(mockProducts.map((p) => p.brand)))
        .filter((brand) => brand.toLowerCase().includes(query))
        .slice(0, 3)

      const featureSuggestions = Array.from(new Set(mockProducts.flatMap((p) => p.features)))
        .filter((feature) => feature.toLowerCase().includes(query))
        .slice(0, 3)

      const allSuggestions = [...productSuggestions, ...brandSuggestions, ...featureSuggestions]
      setSuggestions(Array.from(new Set(allSuggestions)).slice(0, 8))
    } else {
      setSuggestions([])
    }
  }, [searchQuery])

  // Perform search with filters
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true)

      // Simulate API delay
      const searchTimeout = setTimeout(() => {
        let filtered = mockProducts

        // Text search
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(query) ||
              product.brand.toLowerCase().includes(query) ||
              product.specs.some((spec) => spec.toLowerCase().includes(query)) ||
              product.features.some((feature) => feature.toLowerCase().includes(query)) ||
              product.category.toLowerCase().includes(query),
          )
        }

        // Apply filters
        if (filters.category.length > 0) {
          filtered = filtered.filter((product) => filters.category.includes(product.category))
        }

        if (filters.brand.length > 0) {
          filtered = filtered.filter((product) => filters.brand.includes(product.brand))
        }

        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200000) {
          filtered = filtered.filter(
            (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
          )
        }

        if (filters.rating > 0) {
          filtered = filtered.filter((product) => product.rating >= filters.rating)
        }

        if (filters.availability.length > 0) {
          filtered = filtered.filter((product) =>
            filters.availability.some((branch) => product.availability.includes(branch)),
          )
        }

        if (filters.features.length > 0) {
          filtered = filtered.filter((product) =>
            filters.features.some((feature) => product.features.includes(feature)),
          )
        }

        setResults(filtered)
        setIsSearching(false)
      }, 300)

      return () => clearTimeout(searchTimeout)
    } else {
      setResults([])
      setIsSearching(false)
    }
  }, [searchQuery, filters])

  const addRecentSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      const updated = [query, ...recentSearches.slice(0, 4)]
      setRecentSearches(updated)
      localStorage.setItem("lnsc-recent-searches", JSON.stringify(updated))
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("lnsc-recent-searches")
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        results,
        suggestions,
        isSearching,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}