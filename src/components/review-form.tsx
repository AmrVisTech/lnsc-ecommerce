/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Upload, X, Plus, Minus, Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useReviews, type ProductReview } from "@/lib/reviews-context"

interface ReviewFormProps {
  productId: number
  productName: string
  existingReview?: ProductReview
  onClose: () => void
  onSuccess?: () => void
}

export default function ReviewForm({ productId, productName, existingReview, onClose, onSuccess }: ReviewFormProps) {
  const { submitReview, updateReview, isSubmitting } = useReviews()

  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || "",
    comment: existingReview?.comment || "",
    pros: existingReview?.pros || [""],
    cons: existingReview?.cons || [""],
    images: existingReview?.images || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [dragActive, setDragActive] = useState(false)

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
    setErrors((prev) => ({ ...prev, rating: "" }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleArrayChange = (field: "pros" | "cons", index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const addArrayItem = (field: "pros" | "cons") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (field: "pros" | "cons", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            alt: `Review image for ${productName}`,
          }
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, newImage],
          }))
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (imageId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating"
    }
    if (!formData.title.trim()) {
      newErrors.title = "Please enter a review title"
    }
    if (!formData.comment.trim()) {
      newErrors.comment = "Please write your review"
    }
    if (formData.comment.trim().length < 10) {
      newErrors.comment = "Review must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const reviewData = {
      productId,
      userId: "current-user", // Mock current user
      userName: "Current User", // Mock current user name
      userAvatar: "/placeholder.svg?height=40&width=40&text=CU",
      rating: formData.rating,
      title: formData.title.trim(),
      comment: formData.comment.trim(),
      images: formData.images,
      pros: formData.pros.filter((pro) => pro.trim()),
      cons: formData.cons.filter((con) => con.trim()),
      verified: true, // Mock verified purchase
    }

    try {
      if (existingReview) {
        await updateReview(existingReview.id, reviewData)
      } else {
        await submitReview(reviewData)
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              {existingReview ? "Edit Review" : "Write a Review"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{productName}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">Overall Rating *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {formData.rating > 0 && `${formData.rating} star${formData.rating !== 1 ? "s" : ""}`}
                </span>
              </div>
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Review Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Summarize your experience..."
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment" className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Your Review *
              </Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                placeholder="Share your detailed experience with this product..."
                rows={4}
                className={errors.comment ? "border-red-500" : ""}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.comment && <p className="text-red-500 text-sm">{errors.comment}</p>}
                <p className="text-gray-500 text-sm ml-auto">{formData.comment.length}/1000 characters</p>
              </div>
            </div>

            {/* Pros */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                What did you like? (Pros)
              </Label>
              <div className="space-y-2">
                {formData.pros.map((pro, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={pro}
                      onChange={(e) => handleArrayChange("pros", index, e.target.value)}
                      placeholder="Enter a positive point..."
                      className="flex-1"
                    />
                    {formData.pros.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem("pros", index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("pros")}
                  className="gap-2 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Add Pro
                </Button>
              </div>
            </div>

            {/* Cons */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                What could be improved? (Cons)
              </Label>
              <div className="space-y-2">
                {formData.cons.map((con, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={con}
                      onChange={(e) => handleArrayChange("cons", index, e.target.value)}
                      placeholder="Enter a point for improvement..."
                      className="flex-1"
                    />
                    {formData.cons.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem("cons", index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("cons")}
                  className="gap-2 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Add Con
                </Button>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                Add Photos (Optional)
              </Label>

              {/* Image Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">Drag and drop images here, or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="gap-2 bg-transparent"
                >
                  <Upload className="w-4 h-4" />
                  Choose Files
                </Button>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {formData.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">* Required fields</p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {existingReview ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}