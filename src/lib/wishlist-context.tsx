"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface WishlistItem {
  id: number
  name: string
  brand: string
  model?: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  availability: string[]
  inStock: boolean
  addedAt: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
  clearWishlist: () => void
  getTotalItems: () => number
  moveToCart: (id: number) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("lnsc-wishlist")
    if (savedWishlist) {
      try {
        setItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("lnsc-wishlist", JSON.stringify(items))
  }, [items])

  const addToWishlist = (item: WishlistItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems // Item already in wishlist
      }
      return [...prevItems, { ...item, addedAt: new Date().toISOString() }]
    })
  }

  const removeFromWishlist = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: number) => {
    return items.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.length
  }

  const moveToCart = (id: number) => {
    // This would integrate with the cart context
    // For now, we'll just remove from wishlist
    removeFromWishlist(id)
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getTotalItems,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}