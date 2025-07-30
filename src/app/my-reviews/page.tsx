/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, Edit, Trash2, Eye, Calendar, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductReview, useReviews } from "@/lib/reviews-context"
import ReviewForm from "@/components/review-form"

// Mock product data for demonstration
const mockProducts = {
  1: { name: "Gaming Beast Pro", image: "/placeholder.svg?height=100&width=100&text=Gaming+Laptop" },
  2: { name: "Business Elite", image: "/placeholder.svg?height=100&width=100&text=Business+Laptop" },
}


export default function MyReviewsPage() {
  const { getUserReviews, deleteReview } = useReviews()
  const [editingReview, setEditingReview] = useState<ProductReview | null>(null)
  const [activeTab, setActiveTab] = useState("published")

  const currentUserId = "current-user" // Mock current user
  const userReviews = getUserReviews(currentUserId)

  const publishedReviews = userReviews.filter((review) => true) // All reviews are published in this mock
  const draftReviews = [] // No drafts in this mock

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      await deleteReview(reviewId)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const ReviewCard = ({ review }: { review: any }) => {
    const product = mockProducts[review.productId as keyof typeof mockProducts]

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
      >
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={product?.image || "/placeholder.svg"}
              alt={product?.name || "Product"}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Review Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white truncate">{review.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{product?.name}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingReview(review)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Rating and Date */}
            <div className="flex items-center gap-4 mb-3">
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
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                {formatDate(review.createdAt)}
                {review.isEdited && (
                  <Badge variant="secondary" className="text-xs">
                    Edited
                  </Badge>
                )}
              </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-3">{review.comment}</p>

            {/* Review Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{review.helpful + review.notHelpful} votes</span>
                </div>
                {review.images.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{review.images.length} photos</span>
                  </div>
                )}
                {review.verified && (
                  <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs">
                    Verified
                  </Badge>
                )}
              </div>

              <Link href={`/product/${review.productId}`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-2">My Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product reviews and help other customers make informed decisions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{userReviews.length}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Total Reviews</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userReviews.reduce((sum, review) => sum + review.helpful + review.notHelpful, 0)}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Total Votes</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userReviews.filter((review) => review.verified).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Verified Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="published">Published ({publishedReviews.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="published" className="mt-6">
            {publishedReviews.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">No Reviews Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start sharing your experience with products you&apos;ve purchased
                </p>
                <Link href="/shop">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Products</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {publishedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <Edit className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">No Draft Reviews</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Draft reviews will appear here when you save them for later
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Review Form Modal */}
        {editingReview && (
          <ReviewForm
            productId={editingReview.productId}
            productName={mockProducts[editingReview.productId as keyof typeof mockProducts]?.name || "Product"}
            existingReview={editingReview}
            onClose={() => setEditingReview(null)}
            onSuccess={() => {
              // Refresh reviews or show success message
            }}
          />
        )}
      </div>
    </div>
  )
}