/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Bell, ShoppingBag, Star, Settings, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmail } from "@/lib/email-context"
import type { EmailPreferences } from "@/lib/email-context"

export default function EmailPreferences() {
  const { preferences, updatePreferences, isLoading } = useEmail()
  const [localPreferences, setLocalPreferences] = useState<EmailPreferences>(() => ({
    userId: preferences?.userId ?? '',
    orderConfirmation: preferences?.orderConfirmation ?? false,
    orderShipped: preferences?.orderShipped ?? false,
    orderDelivered: preferences?.orderDelivered ?? false,
    reviewReminder: preferences?.reviewReminder ?? false,
    reviewResponse: preferences?.reviewResponse ?? false,
    promotionalEmails: preferences?.promotionalEmails ?? false,
    weeklyNewsletter: preferences?.weeklyNewsletter ?? false,
    productRecommendations: preferences?.productRecommendations ?? false,
    priceDropAlerts: preferences?.priceDropAlerts ?? false,
    stockAlerts: preferences?.stockAlerts ?? false,
    systemNotifications: preferences?.systemNotifications ?? false,
    }))
  const [hasChanges, setHasChanges] = useState(false)

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setLocalPreferences((prev: any) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    await updatePreferences(localPreferences)
    setHasChanges(false)
  }

  const handleReset = () => {
    setLocalPreferences(preferences)
    setHasChanges(false)
  }

  const preferenceCategories = [
    {
      id: "orders",
      title: "Order Notifications",
      description: "Stay updated on your order status",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      preferences: [
        {
          key: "orderConfirmation" as const,
          label: "Order Confirmation",
          description: "Receive confirmation when your order is placed",
        },
        {
          key: "orderShipped" as const,
          label: "Order Shipped",
          description: "Get notified when your order ships with tracking info",
        },
        {
          key: "orderDelivered" as const,
          label: "Order Delivered",
          description: "Confirmation when your order is delivered",
        },
      ],
    },
    {
      id: "reviews",
      title: "Review Notifications",
      description: "Manage review-related communications",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      preferences: [
        {
          key: "reviewReminder" as const,
          label: "Review Reminders",
          description: "Gentle reminders to review your purchases",
        },
        {
          key: "reviewResponse" as const,
          label: "Review Responses",
          description: "Notifications when someone responds to your reviews",
        },
      ],
    },
    {
      id: "promotions",
      title: "Promotional Emails",
      description: "Special offers and product recommendations",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      preferences: [
        {
          key: "promotionalEmails" as const,
          label: "Sales & Promotions",
          description: "Special offers, discounts, and flash sales",
        },
        {
          key: "weeklyNewsletter" as const,
          label: "Weekly Newsletter",
          description: "Weekly roundup of new products and tech news",
        },
        {
          key: "productRecommendations" as const,
          label: "Product Recommendations",
          description: "Personalized product suggestions based on your interests",
        },
        {
          key: "priceDropAlerts" as const,
          label: "Price Drop Alerts",
          description: "Notifications when items in your wishlist go on sale",
        },
        {
          key: "stockAlerts" as const,
          label: "Stock Alerts",
          description: "Notifications when out-of-stock items become available",
        },
      ],
    },
    {
      id: "system",
      title: "System Notifications",
      description: "Important account and security updates",
      icon: Settings,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      preferences: [
        {
          key: "systemNotifications" as const,
          label: "System Notifications",
          description: "Important account updates, security alerts, and policy changes",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Email Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Customize which emails you&apos;d like to receive from us</p>
        </div>

        {hasChanges && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} disabled={isLoading} className="bg-transparent">
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          onClick={() => {
            const booleanKeys: (keyof Omit<EmailPreferences, 'userId'>)[] = [
						'orderConfirmation',
						'orderShipped',
						'orderDelivered',
						'reviewReminder',
						'reviewResponse',
						'promotionalEmails',
						'weeklyNewsletter',
						'productRecommendations',
						'priceDropAlerts',
						'stockAlerts',
						'systemNotifications',
					]

					const allEnabled = { ...localPreferences }

					booleanKeys.forEach((key) => {
						allEnabled[key] = true
					})

					setLocalPreferences(allEnabled)
					setHasChanges(true)

          }}
          className="bg-transparent"
        >
          <Bell className="w-4 h-4 mr-2" />
          Enable All
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const booleanKeys: (keyof Omit<EmailPreferences, 'userId'>)[] = [
							'orderConfirmation',
							'orderShipped',
							'orderDelivered',
							'reviewReminder',
							'reviewResponse',
							'promotionalEmails',
							'weeklyNewsletter',
							'productRecommendations',
							'priceDropAlerts',
							'stockAlerts',
							'systemNotifications',
						]

						const allEnabled = { ...localPreferences }

						booleanKeys.forEach((key) => {
							allEnabled[key] = false
						})

						setLocalPreferences(allEnabled)
						setHasChanges(true)

          }}
          className="bg-transparent"
        >
          Disable Optional
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const essentialOnly = {
              ...localPreferences,
              orderConfirmation: true,
              orderShipped: true,
              orderDelivered: true,
              systemNotifications: true,
              reviewReminder: false,
              reviewResponse: false,
              promotionalEmails: false,
              weeklyNewsletter: false,
              productRecommendations: false,
              priceDropAlerts: false,
              stockAlerts: false,
            }
            setLocalPreferences(essentialOnly)
            setHasChanges(true)
          }}
          className="bg-transparent"
        >
          Essential Only
        </Button>
      </div>

      {/* Preference Categories */}
      <div className="space-y-6">
        {preferenceCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  {category.title}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.preferences.map((pref) => (
                  <div key={pref.key} className="flex items-start justify-between space-x-4">
                    <div className="flex-1">
                      <Label htmlFor={pref.key} className="text-sm font-medium cursor-pointer">
                        {pref.label}
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pref.description}</p>
                    </div>
                    <Switch
                      id={pref.key}
                      checked={localPreferences[pref.key]}
                      onCheckedChange={(checked) => handlePreferenceChange(pref.key, checked)}
                      disabled={pref.key === "orderConfirmation" || pref.key === "systemNotifications"}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Important Notice */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Important Notice</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Order confirmations and system notifications cannot be disabled as they contain important information
                about your purchases and account security. You can always unsubscribe from promotional emails using the
                link at the bottom of any promotional email.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}