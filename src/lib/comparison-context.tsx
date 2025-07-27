"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface ComparisonProduct {
  id: number
  name: string
  brand: string
  model: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  availability: string[]
  specs: {
    processor: {
      brand: string
      model: string
      cores: string
      baseSpeed: string
      maxSpeed: string
      cache: string
    }
    graphics: {
      gpu: string
      vram: string
      rayTracing: string
      dlss: string
    }
    memory: {
      ram: string
      maxRam: string
      slots: string
    }
    storage: {
      primary: string
      slots: string
      expandable: string
    }
    display: {
      size: string
      resolution: string
      refreshRate: string
      panel: string
      colorGamut: string
      brightness: string
    }
    connectivity: {
      wifi: string
      bluetooth: string
      ethernet: string
      usb: string
      hdmi: string
      audio: string
    }
    physical: {
      dimensions: string
      weight: string
      battery: string
      adapter: string
      keyboard: string
      trackpad: string
    }
  }
  features: string[]
  keyFeatures: string[]
}

interface ComparisonContextType {
  comparisonProducts: ComparisonProduct[]
  addToComparison: (product: ComparisonProduct) => void
  removeFromComparison: (productId: number) => void
  clearComparison: () => void
  isInComparison: (productId: number) => boolean
  isComparisonOpen: boolean
  setIsComparisonOpen: (open: boolean) => void
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonProducts, setComparisonProducts] = useState<ComparisonProduct[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  // Load comparison from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lnsc-comparison")
    if (saved) {
      setComparisonProducts(JSON.parse(saved))
    }
  }, [])

  // Save comparison to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lnsc-comparison", JSON.stringify(comparisonProducts))
  }, [comparisonProducts])

  const addToComparison = (product: ComparisonProduct) => {
    setComparisonProducts((prev) => {
      // Limit to 4 products for comparison
      if (prev.length >= 4) {
        return prev
      }
      // Don't add if already in comparison
      if (prev.some((p) => p.id === product.id)) {
        return prev
      }
      return [...prev, product]
    })
  }

  const removeFromComparison = (productId: number) => {
    setComparisonProducts((prev) => prev.filter((product) => product.id !== productId))
  }

  const clearComparison = () => {
    setComparisonProducts([])
  }

  const isInComparison = (productId: number) => {
    return comparisonProducts.some((product) => product.id === productId)
  }

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        isComparisonOpen,
        setIsComparisonOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export const useComparison = () => {
  const context = useContext(ComparisonContext)
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider")
  }
  return context
}