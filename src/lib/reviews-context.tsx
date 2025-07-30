"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface ReviewImage {
  id: string
  url: string
  alt: string
}

export interface ProductReview {
  id: string
  productId: number
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  images: ReviewImage[]
  pros: string[]
  cons: string[]
  verified: boolean
  helpful: number
  notHelpful: number
  userHelpfulVote?: "helpful" | "not-helpful" | null
  createdAt: string
  updatedAt?: string
  isEdited: boolean
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  verifiedPurchases: number
  withPhotos: number
}

interface ReviewsContextType {
  reviews: ProductReview[]
  reviewStats: ReviewStats
  userReviews: ProductReview[]
  isSubmitting: boolean
  submitReview: (
    review: Omit<ProductReview, "id" | "createdAt" | "helpful" | "notHelpful" | "userHelpfulVote" | "isEdited">,
  ) => Promise<void>
  updateReview: (reviewId: string, updates: Partial<ProductReview>) => Promise<void>
  deleteReview: (reviewId: string) => Promise<void>
  voteHelpful: (reviewId: string, vote: "helpful" | "not-helpful") => Promise<void>
  getProductReviews: (productId: number) => ProductReview[]
  getUserReviews: (userId: string) => ProductReview[]
  canUserReview: (productId: number, userId: string) => boolean
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

// Mock data for demonstration
const mockReviews: ProductReview[] = [
  {
    id: "1",
    productId: 1,
    userId: "user1",
    userName: "GamerPro2024",
    userAvatar: "/placeholder.svg?height=40&width=40&text=GP",
    rating: 5,
    title: "Incredible Gaming Performance!",
    comment:
      "This laptop exceeded my expectations. Running Cyberpunk 2077 at ultra settings with RTX on and getting 80+ FPS. The cooling system is excellent - never gets too hot even during long gaming sessions. The RGB keyboard is beautiful and the build quality feels premium.",
    images: [
      { id: "img1", url: "/placeholder.svg?height=300&width=400&text=Gaming+Setup", alt: "Gaming setup with laptop" },
      { id: "img2", url: "/placeholder.svg?height=300&width=400&text=RGB+Keyboard", alt: "RGB keyboard in action" },
    ],
    pros: ["Excellent gaming performance", "Great cooling system", "Beautiful RGB keyboard", "Premium build quality"],
    cons: ["Battery life could be better", "Quite heavy for travel"],
    verified: true,
    helpful: 23,
    notHelpful: 2,
    userHelpfulVote: null,
    createdAt: "2024-01-15T10:30:00Z",
    isEdited: false,
  },
  {
    id: "2",
    productId: 1,
    userId: "user2",
    userName: "TechReviewer",
    userAvatar: "/placeholder.svg?height=40&width=40&text=TR",
    rating: 4,
    title: "Great for Content Creation",
    comment:
      "Perfect for video editing and 3D rendering. The RTX 4070 handles everything I throw at it. Only minor complaint is the battery life during heavy workloads, but that's expected for a gaming laptop.",
    images: [],
    pros: ["Powerful for content creation", "Good display quality", "Fast SSD"],
    cons: ["Battery life during heavy use", "Fan noise under load"],
    verified: true,
    helpful: 18,
    notHelpful: 1,
    userHelpfulVote: null,
    createdAt: "2024-01-10T14:20:00Z",
    isEdited: false,
  },
]

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<ProductReview[]>(mockReviews)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load reviews from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lnsc-reviews")
    if (saved) {
      setReviews(JSON.parse(saved))
    }
  }, [])

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lnsc-reviews", JSON.stringify(reviews))
  }, [reviews])

  const calculateReviewStats = (productReviews: ProductReview[]): ReviewStats => {
  const totalReviews = productReviews.length
  const averageRating =
    totalReviews > 0 ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  productReviews.forEach((review) => {
    ratingDistribution[review.rating]++
  })

  const verifiedPurchases = productReviews.filter((review) => review.verified).length
  const withPhotos = productReviews.filter((review) => review.images.length > 0).length

  return {
    totalReviews,
    averageRating,
    ratingDistribution,
    verifiedPurchases,
    withPhotos,
  }
}


  const submitReview = async (
    reviewData: Omit<ProductReview, "id" | "createdAt" | "helpful" | "notHelpful" | "userHelpfulVote" | "isEdited">,
  ) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newReview: ProductReview = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
      userHelpfulVote: null,
      isEdited: false,
    }

    setReviews((prev) => [newReview, ...prev])
    setIsSubmitting(false)
  }

  const updateReview = async (reviewId: string, updates: Partial<ProductReview>) => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, ...updates, updatedAt: new Date().toISOString(), isEdited: true }
          : review,
      ),
    )
    setIsSubmitting(false)
  }

  const deleteReview = async (reviewId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setReviews((prev) => prev.filter((review) => review.id !== reviewId))
  }

  const voteHelpful = async (reviewId: string, vote: "helpful" | "not-helpful") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    setReviews((prev) =>
      prev.map((review) => {
        if (review.id === reviewId) {
          const currentVote = review.userHelpfulVote
          let helpful = review.helpful
          let notHelpful = review.notHelpful

          // Remove previous vote if exists
          if (currentVote === "helpful") helpful--
          if (currentVote === "not-helpful") notHelpful--

          // Add new vote if different from current
          if (vote !== currentVote) {
            if (vote === "helpful") helpful++
            if (vote === "not-helpful") notHelpful++

            return {
              ...review,
              helpful,
              notHelpful,
              userHelpfulVote: vote,
            }
          } else {
            // Remove vote if same as current
            return {
              ...review,
              helpful,
              notHelpful,
              userHelpfulVote: null,
            }
          }
        }
        return review
      }),
    )
  }

  const getProductReviews = (productId: number) => {
    return reviews.filter((review) => review.productId === productId)
  }

  const getUserReviews = (userId: string) => {
    return reviews.filter((review) => review.userId === userId)
  }

  const canUserReview = (productId: number, userId: string) => {
    // Check if user has already reviewed this product
    return !reviews.some((review) => review.productId === productId && review.userId === userId)
  }

  const productReviews = reviews
  const reviewStats = calculateReviewStats(productReviews)
  const userReviews = reviews.filter((review) => review.userId === "current-user") // Mock current user

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        reviewStats,
        userReviews,
        isSubmitting,
        submitReview,
        updateReview,
        deleteReview,
        voteHelpful,
        getProductReviews,
        getUserReviews,
        canUserReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  )
}

export const useReviews = () => {
  const context = useContext(ReviewsContext)
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}