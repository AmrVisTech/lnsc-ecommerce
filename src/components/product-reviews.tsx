/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Star, ThumbsUp, ThumbsDown, Shield, User, Edit, Trash2, Camera, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useReviews, type ProductReview } from "@/lib/reviews-context"
import ReviewForm from "@/components/review-form"

interface ProductReviewsProps {
  productId: number
  productName: string
  currentUserId?: string
}

export default function ProductReviews({
  productId,
  productName,
  currentUserId = "current-user",
}: ProductReviewsProps) {
  const { getProductReviews, voteHelpful, deleteReview, canUserReview } = useReviews()
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<ProductReview | null>(null)
  const [expandedImages, setExpandedImages] = useState<string | null>(null)

  const productReviews = getProductReviews(productId)

  // Calculate review statistics
  const totalReviews = productReviews.length
  const averageRating =
    totalReviews > 0 ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = productReviews.filter((review) => review.rating === stars).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { stars, count, percentage }
  })

  const verifiedCount = productReviews.filter((review) => review.verified).length
  const withPhotosCount = productReviews.filter((review) => review.images.length > 0).length

  // Filter and sort reviews
  let filteredReviews = [...productReviews]

  // Apply filters
  if (filterBy !== "all") {
    switch (filterBy) {
      case "verified":
        filteredReviews = filteredReviews.filter((review) => review.verified)
        break
      case "photos":
        filteredReviews = filteredReviews.filter((review) => review.images.length > 0)
        break
      case "5-star":
      case "4-star":
      case "3-star":
      case "2-star":
      case "1-star":
        const rating = Number.parseInt(filterBy.split("-")[0])
        filteredReviews = filteredReviews.filter((review) => review.rating === rating)
        break
    }
  }

  // Apply sorting
  filteredReviews.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const handleHelpfulVote = async (reviewId: string, vote: "helpful" | "not-helpful") => {
    await voteHelpful(reviewId, vote)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(reviewId)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const canWriteReview = canUserReview(productId, currentUserId)
  const userReview = productReviews.find((review) => review.userId === currentUserId)

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Based on {totalReviews} reviews</p>

            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>{verifiedCount} verified</span>
              </div>
              <div className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                <span>{withPhotosCount} with photos</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
              </div>
            ))}
          </div>

          {/* Write Review Button */}
          <div className="flex flex-col items-center justify-center">
            {canWriteReview ? (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Edit className="w-4 h-4" />
                Write a Review
              </Button>
            ) : userReview ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">You&apos;ve reviewed this product</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingReview(userReview)}
                  className="gap-2 bg-transparent"
                >
                  <Edit className="w-4 h-4" />
                  Edit Review
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                You can only review products you&apos;ve purchased
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant={filterBy === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterBy("all")}>
              All ({totalReviews})
            </Button>
            <Button
              variant={filterBy === "verified" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterBy("verified")}
            >
              Verified ({verifiedCount})
            </Button>
            <Button
              variant={filterBy === "photos" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterBy("photos")}
            >
              With Photos ({withPhotosCount})
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution.find((r) => r.stars === rating)?.count || 0
              if (count === 0) return null
              return (
                <Button
                  key={rating}
                  variant={filterBy === `${rating}-star` ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterBy(`${rating}-star`)}
                >
                  {rating} Star ({count})
                </Button>
              )
            })}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No reviews match your filters.</p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                    {review.userAvatar ? (
                      <Image
                        src={review.userAvatar || "/placeholder.svg"}
                        alt={review.userName}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{review.userName}</span>
                      {review.verified && (
                        <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                      {review.isEdited && (
                        <Badge variant="secondary" className="text-xs">
                          Edited
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Review Actions */}
                {review.userId === currentUserId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingReview(review)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{review.comment}</p>

                {/* Pros and Cons */}
                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {review.pros.length > 0 && (
                      <div>
                        <h5 className="font-medium text-green-600 dark:text-green-400 mb-2">Pros:</h5>
                        <ul className="space-y-1">
                          {review.pros.map((pro, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-green-500 mt-1">+</span>
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-600 dark:text-red-400 mb-2">Cons:</h5>
                        <ul className="space-y-1">
                          {review.cons.map((con, i) => (
                            <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <span className="text-red-500 mt-1">-</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Review Images */}
                {review.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {review.images.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => setExpandedImages(image.id)}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpfulVote(review.id, "helpful")}
                    className={`gap-2 ${
                      review.userHelpfulVote === "helpful"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpfulVote(review.id, "not-helpful")}
                    className={`gap-2 ${
                      review.userHelpfulVote === "not-helpful"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Not Helpful ({review.notHelpful})
                  </Button>
                </div>

                <span className="text-sm text-gray-500 dark:text-gray-400">Was this review helpful?</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {expandedImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImages(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
            >
              {(() => {
                const image = filteredReviews
                  .flatMap((review) => review.images)
                  .find((img) => img.id === expandedImages)
                return image ? (
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    className="object-contain max-w-full max-h-full rounded-lg"
                  />
                ) : null
              })()}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpandedImages(null)}
                className="absolute top-2 right-2 bg-white/20 hover:bg-white/30 text-white"
              >
                ×
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form Modal */}
      <AnimatePresence>
        {(showReviewForm || editingReview) && (
          <ReviewForm
            productId={productId}
            productName={productName}
            existingReview={editingReview || undefined}
            onClose={() => {
              setShowReviewForm(false)
              setEditingReview(null)
            }}
            onSuccess={() => {
              // Refresh reviews or show success message
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}