"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { X, BarChart3, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useComparison } from "@/lib/comparison-context"

export default function ComparisonBar() {
  const { comparisonProducts, removeFromComparison, clearComparison } = useComparison()

  if (comparisonProducts.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Compare ({comparisonProducts.length}/4)
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto">
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="relative flex-shrink-0">
                    <div className="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={64}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}

                {/* Add more placeholder */}
                {comparisonProducts.length < 4 && (
                  <div className="w-16 h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">+</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={clearComparison} className="bg-transparent">
                Clear All
              </Button>
              <Link href="/compare">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  Compare Now
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}