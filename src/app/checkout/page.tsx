"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, MapPin, User, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/lib/cart-context"
import { useEmailIntegration } from "@/hooks/use-email-integration"

const branches = [
  { id: "zamboanga", name: "Zamboanga City", address: "Mayor Jaldon Street, Zamboanga City" },
  { id: "davao", name: "Davao City", address: "Roxas Avenue, Davao City" },
  { id: "cdo", name: "Cagayan de Oro", address: "Corrales Avenue, CDO" },
  { id: "butuan", name: "Butuan City", address: "J.C. Aquino Avenue, Butuan" },
]

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const { sendOrderConfirmation, scheduleReviewReminder } = useEmailIntegration()
  const [step, setStep] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)
  const [formData, setFormData] = useState({
    // Customer Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Delivery/Pickup
    deliveryMethod: "pickup",
    selectedBranch: "",
    address: "",
    city: "",
    zipCode: "",

    // Payment
    paymentMethod: "cod",
    notes: "",
  })

  const subtotal = getTotalPrice()
  const shipping = formData.deliveryMethod === "delivery" ? (subtotal > 50000 ? 0 : 500) : 0
  const total = subtotal + shipping

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitOrder = async () => {
    // Simulate order processing
    setOrderComplete(true)

    // Generate order number
    const orderNumber = `LNSC${Date.now()}`

    // Send order confirmation email
    try {
      await sendOrderConfirmation({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        orderNumber,
        orderDate: new Date().toLocaleDateString(),
        orderTotal: total,
        paymentMethod: formData.paymentMethod === "cod" ? "Cash on Delivery" : formData.paymentMethod.toUpperCase(),
        items: items.map((item) => ({
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
      })

      // Schedule review reminders for each product
      for (const item of items) {
        await scheduleReviewReminder({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          productName: item.name,
          productImage: item.image,
          productId: item.id,
          purchaseDate: new Date().toLocaleDateString(),
        })
      }
    } catch (error) {
      console.error("Failed to send order confirmation:", error)
    }

    setTimeout(() => {
      clearCart()
    }, 2000)
  }

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
          <Link href="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your order. We&apos;ve sent a confirmation email with all the details.
          </p>
          <div className="space-y-3">
            <Link href="/shop">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete your order</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-16 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Customer Info</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Delivery</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              {/* Step 1: Customer Information */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Customer Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                  >
                    Continue to Delivery
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Delivery Method */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Delivery Method</h2>
                  </div>

                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value) => handleInputChange("deliveryMethod", value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1">
                        <div className="font-medium">Store Pickup (Free)</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Pick up your order at any of our branches
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1">
                        <div className="font-medium">Home Delivery</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ₱500 delivery fee (Free for orders over ₱50,000)
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.deliveryMethod === "pickup" && (
                    <div>
                      <Label>Select Branch</Label>
                      <Select
                        value={formData.selectedBranch}
                        onValueChange={(value) => handleInputChange("selectedBranch", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              <div>
                                <div className="font-medium">{branch.name}</div>
                                <div className="text-sm text-gray-500">{branch.address}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.deliveryMethod === "delivery" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Delivery Address</Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Enter your complete address"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={formData.zipCode}
                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                            placeholder="ZIP Code"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={
                        formData.deliveryMethod === "pickup"
                          ? !formData.selectedBranch
                          : !formData.address || !formData.city || !formData.zipCode
                      }
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                  </div>

                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1">
                        <div className="font-medium">Cash on Delivery/Pickup</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive your order</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="gcash" id="gcash" />
                      <Label htmlFor="gcash" className="flex-1">
                        <div className="font-medium">GCash</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Pay via GCash mobile wallet</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex-1">
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Direct bank transfer</div>
                      </Label>
                    </div>
                  </RadioGroup>

                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any special instructions for your order"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmitOrder}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-pacifico"
                    >
                      Place Order
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={50}
                      height={40}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ₱{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formData.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {shipping === 0 ? "FREE" : `₱${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">₱{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}