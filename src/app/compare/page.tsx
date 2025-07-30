/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  X,
  Star,
  Check,
  Minus,
  ShoppingCart,
  Heart,
  BarChart3,
  Cpu,
  HardDrive,
  Monitor,
  Wifi,
  Ruler,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useComparison } from "@/lib/comparison-context"
import { useCart } from "@/lib/cart-context"

export default function ComparePage() {
  const { comparisonProducts, removeFromComparison, clearComparison } = useComparison()
  const { addItem } = useCart()
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      specs: product.keyFeatures.slice(0, 3),
      selectedBranch: product.availability[0],
    })
  }

  if (comparisonProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">No Products to Compare</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add products to comparison from the shop or product pages to see them here.
          </p>
          <Link href="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Helper function to check if values are different across products
  const areValuesDifferent = (values: any[]) => {
    return new Set(values).size > 1
  }

  // Helper function to get comparison value with highlighting
  const getComparisonValue = (values: any[], index: number, type: "number" | "string" = "string") => {
    if (type === "number") {
      const numValues = values.map((v) => Number.parseFloat(v.toString().replace(/[^\d.]/g, "")))
      const maxValue = Math.max(...numValues)
      const minValue = Math.min(...numValues)
      const currentValue = numValues[index]

      if (currentValue === maxValue && maxValue !== minValue) {
        return { value: values[index], highlight: "best" }
      } else if (currentValue === minValue && maxValue !== minValue) {
        return { value: values[index], highlight: "worst" }
      }
    }
    return { value: values[index], highlight: "neutral" }
  }

  const ComparisonRow = ({
    label,
    values,
    type = "string",
    icon,
  }: {
    label: string
    values: any[]
    type?: "number" | "string"
    icon?: React.ReactNode
  }) => {
    const isDifferent = areValuesDifferent(values)

    if (showDifferencesOnly && !isDifferent) {
      return null
    }

    return (
      <div className="grid grid-cols-5 gap-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
          {icon}
          {label}
        </div>
        {values.map((_, index) => {
          const comparison = getComparisonValue(values, index, type)
          return (
            <div
              key={index}
              className={`text-sm ${
                comparison.highlight === "best"
                  ? "text-green-600 dark:text-green-400 font-semibold"
                  : comparison.highlight === "worst"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {comparison.value || "—"}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/shop">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Compare Laptops</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Compare {comparisonProducts.length} products side by side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="differences-only" checked={showDifferencesOnly} onCheckedChange={setShowDifferencesOnly} />
              <Label htmlFor="differences-only" className="text-sm">
                Show differences only
              </Label>
            </div>
            <Button variant="outline" onClick={clearComparison} className="bg-transparent">
              Clear All
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start p-6 bg-gray-50 dark:bg-gray-700">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              {/* Product Headers */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="font-medium text-gray-500 dark:text-gray-400">Product</div>
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="relative">
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="aspect-[4/3] mb-4 bg-white dark:bg-gray-600 rounded-lg overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.brand}
                        </Badge>
                        <h3 className="font-serif font-bold text-gray-900 dark:text-white text-sm leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{product.model}</p>

                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {product.rating} ({product.reviewCount})
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ₱{product.price.toLocaleString()}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">
                              ₱{product.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </Button>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            <Heart className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Basic Comparison */}
              <div className="space-y-1">
                <ComparisonRow
                  label="Price"
                  values={comparisonProducts.map((p) => `₱${p.price.toLocaleString()}`)}
                  type="number"
                />
                <ComparisonRow
                  label="Rating"
                  values={comparisonProducts.map((p) => `${p.rating}/5 (${p.reviewCount} reviews)`)}
                  type="number"
                />
                <ComparisonRow label="Category" values={comparisonProducts.map((p) => p.category)} />
                <ComparisonRow label="Availability" values={comparisonProducts.map((p) => p.availability.join(", "))} />
              </div>
            </TabsContent>

            <TabsContent value="specs" className="p-6">
              <div className="space-y-8">
                {/* Processor */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    Processor
                  </h3>
                  <div className="space-y-1">
                    <ComparisonRow label="Brand" values={comparisonProducts.map((p) => p.specs.processor.brand)} />
                    <ComparisonRow label="Model" values={comparisonProducts.map((p) => p.specs.processor.model)} />
                    <ComparisonRow label="Cores" values={comparisonProducts.map((p) => p.specs.processor.cores)} />
                    <ComparisonRow
                      label="Base Speed"
                      values={comparisonProducts.map((p) => p.specs.processor.baseSpeed)}
                      type="number"
                    />
                    <ComparisonRow
                      label="Max Speed"
                      values={comparisonProducts.map((p) => p.specs.processor.maxSpeed)}
                      type="number"
                    />
                    <ComparisonRow
                      label="Cache"
                      values={comparisonProducts.map((p) => p.specs.processor.cache)}
                      type="number"
                    />
                  </div>
                </div>

                {/* Graphics */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-600" />
                    Graphics
                  </h3>
                  <div className="space-y-1">
                    <ComparisonRow label="GPU" values={comparisonProducts.map((p) => p.specs.graphics.gpu)} />
                    <ComparisonRow
                      label="VRAM"
                      values={comparisonProducts.map((p) => p.specs.graphics.vram)}
                      type="number"
                    />
                    <ComparisonRow
                      label="Ray Tracing"
                      values={comparisonProducts.map((p) => p.specs.graphics.rayTracing)}
                    />
                    <ComparisonRow label="DLSS" values={comparisonProducts.map((p) => p.specs.graphics.dlss)} />
                  </div>
                </div>

                {/* Memory & Storage */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-purple-600" />
                    Memory & Storage
                  </h3>
                  <div className="space-y-1">
                    <ComparisonRow
                      label="RAM"
                      values={comparisonProducts.map((p) => p.specs.memory.ram)}
                      type="number"
                    />
                    <ComparisonRow
                      label="Max RAM"
                      values={comparisonProducts.map((p) => p.specs.memory.maxRam)}
                      type="number"
                    />
                    <ComparisonRow label="RAM Slots" values={comparisonProducts.map((p) => p.specs.memory.slots)} />
                    <ComparisonRow
                      label="Primary Storage"
                      values={comparisonProducts.map((p) => p.specs.storage.primary)}
                    />
                    <ComparisonRow
                      label="Storage Slots"
                      values={comparisonProducts.map((p) => p.specs.storage.slots)}
                    />
                    <ComparisonRow
                      label="Expandable"
                      values={comparisonProducts.map((p) => p.specs.storage.expandable)}
                    />
                  </div>
                </div>

                {/* Display */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-orange-600" />
                    Display
                  </h3>
                  <div className="space-y-1">
                    <ComparisonRow
                      label="Size"
                      values={comparisonProducts.map((p) => p.specs.display.size)}
                      type="number"
                    />
                    <ComparisonRow
                      label="Resolution"
                      values={comparisonProducts.map((p) => p.specs.display.resolution)}
                    />
                    <ComparisonRow
                      label="Refresh Rate"
                      values={comparisonProducts.map((p) => p.specs.display.refreshRate)}
                      type="number"
                    />
                    <ComparisonRow label="Panel Type" values={comparisonProducts.map((p) => p.specs.display.panel)} />
                    <ComparisonRow
                      label="Color Gamut"
                      values={comparisonProducts.map((p) => p.specs.display.colorGamut)}
                    />
                    <ComparisonRow
                      label="Brightness"
                      values={comparisonProducts.map((p) => p.specs.display.brightness)}
                      type="number"
                    />
                  </div>
                </div>

                {/* Connectivity */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-cyan-600" />
                    Connectivity
                  </h3>
                  <div className="space-y-1">
                    <ComparisonRow label="Wi-Fi" values={comparisonProducts.map((p) => p.specs.connectivity.wifi)} />
                    <ComparisonRow
                      label="Bluetooth"
                      values={comparisonProducts.map((p) => p.specs.connectivity.bluetooth)}
                    />
                    <ComparisonRow
                      label="Ethernet"
                      values={comparisonProducts.map((p) => p.specs.connectivity.ethernet)}
                    />
                    <ComparisonRow label="USB Ports" values={comparisonProducts.map((p) => p.specs.connectivity.usb)} />
                    <ComparisonRow label="HDMI" values={comparisonProducts.map((p) => p.specs.connectivity.hdmi)} />
                    <ComparisonRow label="Audio" values={comparisonProducts.map((p) => p.specs.connectivity.audio)} />
                  </div>
                </div>

                {/* Physical */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-red-600" />
                    Physical
                  </h3>
                  <div className="space-y-1">
                    <ComparisonRow
                      label="Dimensions"
                      values={comparisonProducts.map((p) => p.specs.physical.dimensions)}
                    />
                    <ComparisonRow
                      label="Weight"
                      values={comparisonProducts.map((p) => p.specs.physical.weight)}
                      type="number"
                    />
                    <ComparisonRow
                      label="Battery"
                      values={comparisonProducts.map((p) => p.specs.physical.battery)}
                      type="number"
                    />
                    <ComparisonRow
                      label="Power Adapter"
                      values={comparisonProducts.map((p) => p.specs.physical.adapter)}
                      type="number"
                    />
                    <ComparisonRow label="Keyboard" values={comparisonProducts.map((p) => p.specs.physical.keyboard)} />
                    <ComparisonRow label="Trackpad" values={comparisonProducts.map((p) => p.specs.physical.trackpad)} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="p-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Features Comparison
                </h3>

                {/* Get all unique features */}
                {(() => {
                  const allFeatures = Array.from(
                    new Set(comparisonProducts.flatMap((product) => product.features)),
                  ).sort()

                  return (
                    <div className="space-y-1">
                      {allFeatures.map((feature) => {
                        const hasFeature = comparisonProducts.map((product) => product.features.includes(feature))
                        const isDifferent = areValuesDifferent(hasFeature)

                        if (showDifferencesOnly && !isDifferent) {
                          return null
                        }

                        return (
                          <div
                            key={feature}
                            className="grid grid-cols-5 gap-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900 dark:text-white">{feature}</div>
                            {hasFeature.map((has, index) => (
                              <div key={index} className="flex items-center">
                                {has ? (
                                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Minus className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Need help deciding? Contact our experts for personalized recommendations.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="bg-transparent">
              Get Expert Advice
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}