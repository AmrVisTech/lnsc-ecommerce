"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist, type WishlistItem } from "@/lib/wishlist-context"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  product: {
    id: number
    name: string
    brand: string
    model?: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviewCount?: number
    reviews?: number
    category: string
    availability: string[]
    inStock?: boolean
  }
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
  showText?: boolean
  className?: string
}

export default function WishlistButton({
  product,
  size = "md",
  variant = "outline",
  showText = false,
  className,
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isAnimating, setIsAnimating] = useState(false)

  const inWishlist = isInWishlist(product.id)

  const handleToggle = () => {
    setIsAnimating(true)

    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      model: product.model,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      rating: product.rating,
      reviewCount: product.reviewCount || product.reviews || 0,
      category: product.category,
      availability: product.availability,
      inStock: product.inStock ?? true,
      addedAt: new Date().toISOString(),
    }

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(wishlistItem)
    }

    setTimeout(() => setIsAnimating(false), 300)
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
      size={showText ? "default" : "icon"}
      onClick={handleToggle}
      className={cn(
        !showText && sizeClasses[size],
        inWishlist && variant === "outline" && "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950",
        className,
      )}
    >
      <motion.div animate={isAnimating ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
        <Heart className={cn(iconSizes[size], inWishlist && "fill-red-500 text-red-500", !showText && "mx-0")} />
      </motion.div>
      {showText && <span className="ml-2">{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>}
    </Button>
  )
}