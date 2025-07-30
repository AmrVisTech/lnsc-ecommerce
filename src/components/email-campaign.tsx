/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Send, Users, Calendar, Target, Mail, Plus, X, Upload, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useEmailIntegration } from "@/hooks/use-email-integration"

interface FeaturedProduct {
  id: number
  name: string
  image: string
  description: string
  salePrice: number
  originalPrice: number
}

export default function EmailCampaign() {
  const { sendBulkPromotionalEmail } = useEmailIntegration()
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [campaignData, setCampaignData] = useState({
    saleTitle: "",
    discount: 0,
    saleDescription: "",
    promoCode: "",
    saleEndDate: "",
    featuredProducts: [] as FeaturedProduct[],
  })

  const [targetAudience, setTargetAudience] = useState({
    allCustomers: true,
    recentPurchasers: false,
    highValueCustomers: false,
    inactiveCustomers: false,
  })

  // Mock customer data
  const mockCustomers = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Mike Johnson", email: "mike@example.com" },
  ]

  const handleInputChange = (field: string, value: any) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }))
  }

  const addFeaturedProduct = () => {
    const newProduct: FeaturedProduct = {
      id: Date.now(),
      name: "",
      image: "/placeholder.svg?height=100&width=100&text=Product",
      description: "",
      salePrice: 0,
      originalPrice: 0,
    }
    setCampaignData((prev) => ({
      ...prev,
      featuredProducts: [...prev.featuredProducts, newProduct],
    }))
  }

  const updateFeaturedProduct = (id: number, field: string, value: any) => {
    setCampaignData((prev) => ({
      ...prev,
      featuredProducts: prev.featuredProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    }))
  }

  const removeFeaturedProduct = (id: number) => {
    setCampaignData((prev) => ({
      ...prev,
      featuredProducts: prev.featuredProducts.filter((product) => product.id !== id),
    }))
  }

  const handleSendCampaign = async () => {
    setIsLoading(true)

    try {
      await sendBulkPromotionalEmail(mockCustomers, campaignData)
      alert("Campaign sent successfully!")
    } catch (error) {
      console.error("Failed to send campaign:", error)
      alert("Failed to send campaign. Please try again.")
    }

    setIsLoading(false)
  }

  const getEstimatedReach = () => {
    let reach = 0
    if (targetAudience.allCustomers) reach += 1000
    if (targetAudience.recentPurchasers) reach += 250
    if (targetAudience.highValueCustomers) reach += 150
    if (targetAudience.inactiveCustomers) reach += 500
    return Math.min(reach, 1000) // Cap at total customers
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Email Campaign</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Create and send promotional emails to your customers</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)} className="gap-2 bg-transparent">
            <Eye className="w-4 h-4" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            onClick={handleSendCampaign}
            disabled={isLoading || !campaignData.saleTitle}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          >
            <Send className="w-4 h-4" />
            {isLoading ? "Sending..." : "Send Campaign"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Campaign Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Campaign Details
              </CardTitle>
              <CardDescription>Configure your promotional email campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="saleTitle">Sale Title</Label>
                  <Input
                    id="saleTitle"
                    value={campaignData.saleTitle}
                    onChange={(e) => handleInputChange("saleTitle", e.target.value)}
                    placeholder="e.g., Black Friday Sale"
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount Percentage</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={campaignData.discount}
                    onChange={(e) => handleInputChange("discount", Number(e.target.value))}
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="saleDescription">Sale Description</Label>
                <Textarea
                  id="saleDescription"
                  value={campaignData.saleDescription}
                  onChange={(e) => handleInputChange("saleDescription", e.target.value)}
                  placeholder="Describe your sale..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                  <Input
                    id="promoCode"
                    value={campaignData.promoCode}
                    onChange={(e) => handleInputChange("promoCode", e.target.value)}
                    placeholder="e.g., SAVE50"
                  />
                </div>
                <div>
                  <Label htmlFor="saleEndDate">Sale End Date</Label>
                  <Input
                    id="saleEndDate"
                    type="datetime-local"
                    value={campaignData.saleEndDate}
                    onChange={(e) => handleInputChange("saleEndDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Featured Products
                </div>
                <Button onClick={addFeaturedProduct} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </CardTitle>
              <CardDescription>Highlight specific products in your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              {campaignData.featuredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No featured products added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {campaignData.featuredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="Product name"
                              value={product.name}
                              onChange={(e) => updateFeaturedProduct(product.id, "name", e.target.value)}
                            />
                            <Input
                              placeholder="Description"
                              value={product.description}
                              onChange={(e) => updateFeaturedProduct(product.id, "description", e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              type="number"
                              placeholder="Sale price"
                              value={product.salePrice}
                              onChange={(e) => updateFeaturedProduct(product.id, "salePrice", Number(e.target.value))}
                            />
                            <Input
                              type="number"
                              placeholder="Original price"
                              value={product.originalPrice}
                              onChange={(e) =>
                                updateFeaturedProduct(product.id, "originalPrice", Number(e.target.value))
                              }
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeaturedProduct(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campaign Settings */}
        <div className="space-y-6">
          {/* Target Audience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Target Audience
              </CardTitle>
              <CardDescription>Choose who will receive this campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allCustomers" className="cursor-pointer">
                    All Customers
                  </Label>
                  <Switch
                    id="allCustomers"
                    checked={targetAudience.allCustomers}
                    onCheckedChange={(checked) => setTargetAudience((prev) => ({ ...prev, allCustomers: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="recentPurchasers" className="cursor-pointer">
                    Recent Purchasers
                  </Label>
                  <Switch
                    id="recentPurchasers"
                    checked={targetAudience.recentPurchasers}
                    onCheckedChange={(checked) => setTargetAudience((prev) => ({ ...prev, recentPurchasers: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="highValueCustomers" className="cursor-pointer">
                    High Value Customers
                  </Label>
                  <Switch
                    id="highValueCustomers"
                    checked={targetAudience.highValueCustomers}
                    onCheckedChange={(checked) =>
                      setTargetAudience((prev) => ({ ...prev, highValueCustomers: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="inactiveCustomers" className="cursor-pointer">
                    Inactive Customers
                  </Label>
                  <Switch
                    id="inactiveCustomers"
                    checked={targetAudience.inactiveCustomers}
                    onCheckedChange={(checked) =>
                      setTargetAudience((prev) => ({ ...prev, inactiveCustomers: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Estimated Reach</span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {getEstimatedReach().toLocaleString()} customers
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Featured Products</span>
                <Badge variant="secondary">{campaignData.featuredProducts.length} products</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Campaign Type</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Promotional</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Send Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Send Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="sendNow" name="schedule" defaultChecked />
                  <Label htmlFor="sendNow" className="cursor-pointer">
                    Send immediately
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="sendLater" name="schedule" />
                  <Label htmlFor="sendLater" className="cursor-pointer">
                    Schedule for later
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}