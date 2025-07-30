"use client"

import { useEmail } from "@/lib/email-context"

export function useEmailIntegration() {
  const { sendEmail, scheduleEmail } = useEmail()

  // Order-related emails
  const sendOrderConfirmation = async (orderData: {
    customerName: string
    customerEmail: string
    orderNumber: string
    orderDate: string
    orderTotal: number
    paymentMethod: string
    items: Array<{
      name: string
      image: string
      quantity: number
      price: number
      total: number
    }>
  }) => {
    await sendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmed - #${orderData.orderNumber}`,
      template: "order-confirmation",
      type: "order",
      variables: {
        ...orderData,
        trackingUrl: `${window.location.origin}/track-order/${orderData.orderNumber}`,
      },
    })
  }

  const sendOrderShipped = async (orderData: {
    customerName: string
    customerEmail: string
    orderNumber: string
    trackingNumber: string
    carrier: string
    estimatedDelivery: string
  }) => {
    await sendEmail({
      to: orderData.customerEmail,
      subject: `Your order is on the way! - #${orderData.orderNumber}`,
      template: "order-shipped",
      type: "order",
      variables: {
        ...orderData,
        trackingUrl: `${window.location.origin}/track-package/${orderData.trackingNumber}`,
      },
    })
  }

  // Review-related emails
  const scheduleReviewReminder = async (
    orderData: {
      customerName: string
      customerEmail: string
      productName: string
      productImage: string
      productId: number
      purchaseDate: string
    },
    daysAfterDelivery = 7,
  ) => {
    const scheduledDate = new Date()
    scheduledDate.setDate(scheduledDate.getDate() + daysAfterDelivery)

    await scheduleEmail(
      {
        to: orderData.customerEmail,
        subject: `How was your ${orderData.productName}? Share your experience`,
        template: "review-reminder",
        type: "review",
        variables: {
          ...orderData,
          reviewUrl: `${window.location.origin}/product/${orderData.productId}#reviews`,
          unsubscribeUrl: `${window.location.origin}/email-settings`,
        },
      },
      scheduledDate.toISOString(),
    )
  }

  // Promotional emails
  const sendPromotionalEmail = async (promotionData: {
    customerName: string
    customerEmail: string
    saleTitle: string
    discount: number
    saleDescription: string
    promoCode?: string
    featuredProducts: Array<{
      name: string
      image: string
      description: string
      salePrice: number
      originalPrice: number
    }>
    saleEndDate: string
  }) => {
    await sendEmail({
      to: promotionData.customerEmail,
      subject: `🔥 ${promotionData.saleTitle} - Up to ${promotionData.discount}% Off!`,
      template: "promotional-sale",
      type: "promotion",
      variables: {
        ...promotionData,
        shopUrl: `${window.location.origin}/shop`,
        unsubscribeUrl: `${window.location.origin}/email-settings`,
      },
    })
  }

  // Bulk promotional emails
  const sendBulkPromotionalEmail = async (
    customers: Array<{ name: string; email: string }>,
    promotionData: Omit<Parameters<typeof sendPromotionalEmail>[0], "customerName" | "customerEmail">,
  ) => {
    const emailPromises = customers.map((customer) =>
      sendPromotionalEmail({
        customerName: customer.name,
        customerEmail: customer.email,
        ...promotionData,
      }),
    )

    await Promise.all(emailPromises)
  }

  return {
    sendOrderConfirmation,
    sendOrderShipped,
    scheduleReviewReminder,
    sendPromotionalEmail,
    sendBulkPromotionalEmail,
  }
}