"use client"

import type React from "react"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist, type WishlistItem } from "@/lib/wishlist-context"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    model: string
    category: string
    brand: string
    rating: number
    reviewCount: number
    inStock: boolean
    availability: string[]
  }
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
  className?: string
}

export default function WishlistButton({ product, size = "md", variant = "ghost", className }: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (inWishlist) {
      removeItem(product.id)
    } else {
      const wishlistItem: WishlistItem = {
        ...product,
        addedAt: new Date(),
      }
      addItem(wishlistItem)
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={handleToggleWishlist}
      className={cn(
        sizeClasses[size],
        "relative group transition-all duration-200",
        inWishlist && "text-red-500 hover:text-red-600",
        !inWishlist && "text-gray-400 hover:text-red-500",
        className,
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div initial={false} animate={{ scale: inWishlist ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
        <Heart className={cn(iconSizes[size], "transition-all duration-200", inWishlist && "fill-current")} />
      </motion.div>

      {/* Pulse effect when adding to wishlist */}
      {inWishlist && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 rounded-full border-2 border-red-500"
        />
      )}
    </Button>
  )
}