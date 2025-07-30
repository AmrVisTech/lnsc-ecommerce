/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  type: "order" | "review" | "promotion" | "system"
  htmlContent: string
  textContent: string
  variables: string[]
}

export interface EmailNotification {
  id: string
  to: string
  subject: string
  template: string
  variables: Record<string, any>
  type: "order" | "review" | "promotion" | "system"
  status: "pending" | "sent" | "failed" | "scheduled"
  scheduledFor?: string
  sentAt?: string
  createdAt: string
  retryCount: number
  error?: string
}

export interface EmailPreferences {
  userId: string
  orderConfirmation: boolean
  orderShipped: boolean
  orderDelivered: boolean
  reviewReminder: boolean
  reviewResponse: boolean
  promotionalEmails: boolean
  weeklyNewsletter: boolean
  productRecommendations: boolean
  priceDropAlerts: boolean
  stockAlerts: boolean
  systemNotifications: boolean
}

interface EmailContextType {
  notifications: EmailNotification[]
  templates: EmailTemplate[]
  preferences: EmailPreferences
  isLoading: boolean
  sendEmail: (notification: Omit<EmailNotification, "id" | "createdAt" | "status" | "retryCount">) => Promise<void>
  scheduleEmail: (
    notification: Omit<EmailNotification, "id" | "createdAt" | "status" | "retryCount">,
    scheduledFor: string,
  ) => Promise<void>
  updatePreferences: (preferences: Partial<EmailPreferences>) => Promise<void>
  getNotificationHistory: (userId: string) => EmailNotification[]
  resendNotification: (notificationId: string) => Promise<void>
  cancelScheduledEmail: (notificationId: string) => Promise<void>
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

// Mock email templates
const mockTemplates: EmailTemplate[] = [
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    subject: "Order Confirmed - #{orderNumber}",
    type: "order",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Hi {{customerName}},</p>
          <p>We've received your order and it's being processed. Here are the details:</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937;">Order #{{orderNumber}}</h3>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Order Date:</strong> {{orderDate}}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Total:</strong> ₱{{orderTotal}}</p>
            <p style="margin: 5px 0; color: #6b7280;"><strong>Payment Method:</strong> {{paymentMethod}}</p>
          </div>
          
          <h3 style="color: #1f2937; margin: 25px 0 15px 0;">Items Ordered:</h3>
          {{#each items}}
          <div style="border-bottom: 1px solid #e5e7eb; padding: 15px 0; display: flex; align-items: center;">
            <img src="{{image}}" alt="{{name}}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 5px 0; color: #1f2937;">{{name}}</h4>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Quantity: {{quantity}} × ₱{{price}}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold; color: #1f2937;">₱{{total}}</p>
            </div>
          </div>
          {{/each}}
          
          <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">What's Next?</h3>
            <p style="margin: 0; color: #1e40af;">We'll send you another email when your order ships. You can track your order status anytime.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{trackingUrl}}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Your Order</a>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Need help? Contact us at <a href="mailto:support@lnsc.ph" style="color: #3b82f6;">support@lnsc.ph</a></p>
          <p>LNSC - Premium Laptops for Mindanao</p>
        </div>
      </div>
    `,
    textContent: `Order Confirmed - #{{orderNumber}}

Hi {{customerName}},

We've received your order and it's being processed. Here are the details:

Order #{{orderNumber}}
Order Date: {{orderDate}}
Total: ₱{{orderTotal}}
Payment Method: {{paymentMethod}}

Items Ordered:
{{#each items}}
- {{name}} (Qty: {{quantity}}) - ₱{{total}}
{{/each}}

We'll send you another email when your order ships. You can track your order at: {{trackingUrl}}

Need help? Contact us at support@lnsc.ph

LNSC - Premium Laptops for Mindanao`,
    variables: ["customerName", "orderNumber", "orderDate", "orderTotal", "paymentMethod", "items", "trackingUrl"],
  },
  {
    id: "order-shipped",
    name: "Order Shipped",
    subject: "Your order is on the way! - #{orderNumber}",
    type: "order",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📦 Order Shipped!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your package is on the way</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Hi {{customerName}},</p>
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #166534;">Shipping Details</h3>
            <p style="margin: 5px 0; color: #166534;"><strong>Tracking Number:</strong> {{trackingNumber}}</p>
            <p style="margin: 5px 0; color: #166534;"><strong>Carrier:</strong> {{carrier}}</p>
            <p style="margin: 5px 0; color: #166534;"><strong>Estimated Delivery:</strong> {{estimatedDelivery}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{trackingUrl}}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Track Package</a>
          </div>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">Delivery Instructions</h3>
            <p style="margin: 0; color: #92400e;">Please ensure someone is available to receive the package. If you're not available, the carrier will leave a delivery notice.</p>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Questions about your delivery? Contact us at <a href="mailto:support@lnsc.ph" style="color: #3b82f6;">support@lnsc.ph</a></p>
        </div>
      </div>
    `,
    textContent: `Your order is on the way! - #{{orderNumber}}

Hi {{customerName}},

Great news! Your order has been shipped and is on its way to you.

Shipping Details:
Tracking Number: {{trackingNumber}}
Carrier: {{carrier}}
Estimated Delivery: {{estimatedDelivery}}

Track your package: {{trackingUrl}}

Please ensure someone is available to receive the package.

Questions? Contact us at support@lnsc.ph`,
    variables: ["customerName", "orderNumber", "trackingNumber", "carrier", "estimatedDelivery", "trackingUrl"],
  },
  {
    id: "review-reminder",
    name: "Review Reminder",
    subject: "How was your {{productName}}? Share your experience",
    type: "review",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">⭐ Share Your Experience</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Help others make informed decisions</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Hi {{customerName}},</p>
          <p>We hope you're enjoying your recent purchase! Your feedback helps other customers make informed decisions.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <img src="{{productImage}}" alt="{{productName}}" style="width: 120px; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">{{productName}}</h3>
            <p style="margin: 0; color: #6b7280;">Purchased on {{purchaseDate}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{reviewUrl}}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Write a Review</a>
          </div>
          
          <div style="background: #ddd6fe; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #5b21b6;">Why Review?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #5b21b6;">
              <li>Help other customers make informed decisions</li>
              <li>Share your experience with the LNSC community</li>
              <li>Provide valuable feedback to improve our products</li>
            </ul>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Don't want review reminders? <a href="{{unsubscribeUrl}}" style="color: #3b82f6;">Update your preferences</a></p>
        </div>
      </div>
    `,
    textContent: `How was your {{productName}}? Share your experience

Hi {{customerName}},

We hope you're enjoying your recent purchase! Your feedback helps other customers make informed decisions.

Product: {{productName}}
Purchased on: {{purchaseDate}}

Write a review: {{reviewUrl}}

Why Review?
- Help other customers make informed decisions
- Share your experience with the LNSC community
- Provide valuable feedback to improve our products

Don't want review reminders? Update your preferences: {{unsubscribeUrl}}`,
    variables: ["customerName", "productName", "productImage", "purchaseDate", "reviewUrl", "unsubscribeUrl"],
  },
  {
    id: "promotional-sale",
    name: "Promotional Sale",
    subject: "🔥 {{saleTitle}} - Up to {{discount}}% Off!",
    type: "promotion",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🔥 {{saleTitle}}</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Up to {{discount}}% Off Premium Laptops!</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <p>Hi {{customerName}},</p>
          <p>Don't miss out on incredible savings! Our {{saleTitle}} is here with amazing discounts on premium laptops.</p>
          
          <div style="background: #fef2f2; border: 2px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h2 style="margin: 0 0 10px 0; color: #dc2626; font-size: 24px;">{{discount}}% OFF</h2>
            <p style="margin: 0; color: #dc2626; font-weight: bold;">{{saleDescription}}</p>
            {{#if promoCode}}
            <div style="background: white; border: 2px dashed #dc2626; padding: 15px; margin: 15px 0; border-radius: 8px;">
              <p style="margin: 0; color: #dc2626; font-size: 18px; font-weight: bold;">Use Code: {{promoCode}}</p>
            </div>
            {{/if}}
          </div>
          
          <h3 style="color: #1f2937; margin: 25px 0 15px 0;">Featured Deals:</h3>
          {{#each featuredProducts}}
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 15px 0; display: flex; align-items: center;">
            <img src="{{image}}" alt="{{name}}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
            <div style="flex: 1;">
              <h4 style="margin: 0 0 5px 0; color: #1f2937;">{{name}}</h4>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">{{description}}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 18px;">₱{{salePrice}}</p>
              <p style="margin: 0; color: #9ca3af; text-decoration: line-through; font-size: 14px;">₱{{originalPrice}}</p>
            </div>
          </div>
          {{/each}}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{shopUrl}}" style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 18px; font-weight: bold;">Shop Now</a>
          </div>
          
          <div style="background: #fbbf24; color: #92400e; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; font-weight: bold;">⏰ Limited Time: Sale ends {{saleEndDate}}</p>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>Don't want promotional emails? <a href="{{unsubscribeUrl}}" style="color: #3b82f6;">Unsubscribe here</a></p>
        </div>
      </div>
    `,
    textContent: `🔥 {{saleTitle}} - Up to {{discount}}% Off!

Hi {{customerName}},

Don't miss out on incredible savings! Our {{saleTitle}} is here with amazing discounts on premium laptops.

{{discount}}% OFF - {{saleDescription}}
{{#if promoCode}}Use Code: {{promoCode}}{{/if}}

Featured Deals:
{{#each featuredProducts}}
- {{name}}: ₱{{salePrice}} (was ₱{{originalPrice}})
{{/each}}

Shop now: {{shopUrl}}

⏰ Limited Time: Sale ends {{saleEndDate}}

Don't want promotional emails? Unsubscribe: {{unsubscribeUrl}}`,
    variables: [
      "customerName",
      "saleTitle",
      "discount",
      "saleDescription",
      "promoCode",
      "featuredProducts",
      "shopUrl",
      "saleEndDate",
      "unsubscribeUrl",
    ],
  },
]

// Mock email preferences
const defaultPreferences: EmailPreferences = {
  userId: "current-user",
  orderConfirmation: true,
  orderShipped: true,
  orderDelivered: true,
  reviewReminder: true,
  reviewResponse: false,
  promotionalEmails: true,
  weeklyNewsletter: false,
  productRecommendations: true,
  priceDropAlerts: true,
  stockAlerts: true,
  systemNotifications: true,
}

export function EmailProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<EmailNotification[]>([])
  const [templates] = useState<EmailTemplate[]>(mockTemplates)
  const [preferences, setPreferences] = useState<EmailPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("lnsc-email-notifications")
    const savedPreferences = localStorage.getItem("lnsc-email-preferences")

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lnsc-email-notifications", JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem("lnsc-email-preferences", JSON.stringify(preferences))
  }, [preferences])

  const sendEmail = async (notificationData: Omit<EmailNotification, "id" | "createdAt" | "status" | "retryCount">) => {
    setIsLoading(true)

    // Check if user has opted out of this type of email
    const canSend = checkEmailPermission(notificationData.type)
    if (!canSend) {
      console.log(`Email blocked by user preferences: ${notificationData.type}`)
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newNotification: EmailNotification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: Math.random() > 0.1 ? "sent" : "failed", // 90% success rate
      retryCount: 0,
      sentAt: Math.random() > 0.1 ? new Date().toISOString() : undefined,
      error: Math.random() > 0.1 ? undefined : "SMTP connection failed",
    }

    setNotifications((prev) => [newNotification, ...prev])
    setIsLoading(false)
  }

  const scheduleEmail = async (
    notificationData: Omit<EmailNotification, "id" | "createdAt" | "status" | "retryCount">,
    scheduledFor: string,
  ) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newNotification: EmailNotification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "scheduled",
      scheduledFor,
      retryCount: 0,
    }

    setNotifications((prev) => [newNotification, ...prev])
    setIsLoading(false)
  }

  const updatePreferences = async (newPreferences: Partial<EmailPreferences>) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setPreferences((prev) => ({ ...prev, ...newPreferences }))
    setIsLoading(false)
  }

  const getNotificationHistory = (userId: string) => {
    return notifications.filter((notification) => notification.to.includes(userId))
  }

  const resendNotification = async (notificationId: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            status: Math.random() > 0.2 ? "sent" : "failed", // 80% success rate on retry
            sentAt: Math.random() > 0.2 ? new Date().toISOString() : notification.sentAt,
            retryCount: notification.retryCount + 1,
            error: Math.random() > 0.2 ? undefined : "Retry failed - invalid email address",
          }
        }
        return notification
      }),
    )

    setIsLoading(false)
  }

  const cancelScheduledEmail = async (notificationId: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
    setIsLoading(false)
  }

  const checkEmailPermission = (type: EmailNotification["type"]): boolean => {
    switch (type) {
      case "order":
        return preferences.orderConfirmation || preferences.orderShipped || preferences.orderDelivered
      case "review":
        return preferences.reviewReminder || preferences.reviewResponse
      case "promotion":
        return preferences.promotionalEmails || preferences.weeklyNewsletter || preferences.productRecommendations
      case "system":
        return preferences.systemNotifications
      default:
        return true
    }
  }

  return (
    <EmailContext.Provider
      value={{
        notifications,
        templates,
        preferences,
        isLoading,
        sendEmail,
        scheduleEmail,
        updatePreferences,
        getNotificationHistory,
        resendNotification,
        cancelScheduledEmail,
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider")
  }
  return context
}