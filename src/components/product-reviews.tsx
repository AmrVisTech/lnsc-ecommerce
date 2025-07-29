"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Review {
  id: number
  user: string
  rating: number
  date: string
  title: string
  comment: string
  helpful: number
  verified: boolean
}

interface ProductReviewsProps {
  reviews: Review[]
  rating: number
  reviewCount: number
}

export default function ProductReviews({ reviews, rating, reviewCount }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, boolean>>({})

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0
    return { stars, count, percentage }
  })

  const handleHelpfulVote = (reviewId: number) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{rating}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400">Based on {reviewCount} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
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

        <div className="space-y-6">
          {reviews.map((review, index) => (
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
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{review.user}</span>
                      {review.verified && (
                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                          <Shield className="w-3 h-3" />
                          Verified Purchase
                        </div>
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
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{review.title}</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleHelpfulVote(review.id)}
                  className={`gap-2 ${
                    helpfulVotes[review.id] ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful + (helpfulVotes[review.id] ? 1 : 0)})
                </Button>

                <span className="text-sm text-gray-500 dark:text-gray-400">Was this review helpful?</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <Button variant="outline" className="bg-transparent">
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  )
}