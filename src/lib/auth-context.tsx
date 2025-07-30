"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  address?: {
    street: string
    city: string
    province: string
    zipCode: string
    country: string
  }
  preferences: {
    newsletter: boolean
    smsNotifications: boolean
    emailNotifications: boolean
  }
  createdAt: string
  lastLogin: string
}

export interface Order {
  id: string
  userId: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    city: string
    province: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  orderDate: string
  estimatedDelivery?: string
  trackingNumber?: string
}

interface AuthContextType {
  user: User | null
  orders: Order[]
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>
  getOrderHistory: () => Order[]
  getOrderById: (orderId: string) => Order | undefined
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock users database (in real app, this would be server-side)
  const [users, setUsers] = useState<Array<User & { password: string }>>([])

  useEffect(() => {
    // Load user data from localStorage on mount
    const savedUser = localStorage.getItem("lnsc-user")
    const savedUsers = localStorage.getItem("lnsc-users")
    const savedOrders = localStorage.getItem("lnsc-orders")

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }

    setIsLoading(false)
  }, [])

  // Save to localStorage whenever user or orders change
  useEffect(() => {
    if (user) {
      localStorage.setItem("lnsc-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("lnsc-user")
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("lnsc-users", JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem("lnsc-orders", JSON.stringify(orders))
  }, [orders])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = users.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      const updatedUser = {
        ...userWithoutPassword,
        lastLogin: new Date().toISOString(),
      }

      setUser(updatedUser)
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: "Invalid email or password" }
  }

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    if (users.find((u) => u.email === userData.email)) {
      setIsLoading(false)
      return { success: false, error: "User with this email already exists" }
    }

    const newUser: User & { password: string } = {
      id: `user_${Date.now()}`,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      preferences: {
        newsletter: true,
        smsNotifications: true,
        emailNotifications: true,
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    setUsers((prev) => [...prev, newUser])

    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    setIsLoading(false)

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("lnsc-user")
  }

  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "No user logged in" }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)

    // Update in users array
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...userData } : u)))

    setIsLoading(false)
    return { success: true }
  }

  const getOrderHistory = (): Order[] => {
    if (!user) return []
    return orders
      .filter((order) => order.userId === user.id)
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  }

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId && order.userId === user?.id)
  }

  // Generate some mock orders for demo
  useEffect(() => {
    if (user && orders.filter((o) => o.userId === user.id).length === 0) {
      const mockOrders: Order[] = [
        {
          id: `order_${Date.now()}_1`,
          userId: user.id,
          items: [
            {
              id: "1",
              name: 'MacBook Pro 14" M3',
              price: 89999,
              quantity: 1,
              image: "/placeholder.svg?height=100&width=100",
            },
          ],
          total: 89999,
          status: "delivered",
          shippingAddress: {
            street: "123 Main St",
            city: "Zamboanga City",
            province: "Zamboanga del Sur",
            zipCode: "7000",
            country: "Philippines",
          },
          paymentMethod: "Credit Card",
          orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: "LNSC123456789",
        },
        {
          id: `order_${Date.now()}_2`,
          userId: user.id,
          items: [
            {
              id: "2",
              name: "Dell XPS 13",
              price: 65999,
              quantity: 1,
              image: "/placeholder.svg?height=100&width=100",
            },
            {
              id: "3",
              name: "Wireless Mouse",
              price: 1299,
              quantity: 2,
              image: "/placeholder.svg?height=100&width=100",
            },
          ],
          total: 68597,
          status: "shipped",
          shippingAddress: {
            street: "123 Main St",
            city: "Zamboanga City",
            province: "Zamboanga del Sur",
            zipCode: "7000",
            country: "Philippines",
          },
          paymentMethod: "PayPal",
          orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: "LNSC987654321",
        },
      ]

      setOrders((prev) => [...prev, ...mockOrders])
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        getOrderHistory,
        getOrderById,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}