import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Pacifico } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-context"
import Navbar from "@/components/navbar"
import { CartProvider } from "@/lib/cart-context"
import { SearchProvider } from "@/lib/search-context"
import { ComparisonProvider } from "@/lib/comparison-context"
import { ReviewsProvider } from "@/lib/reviews-context"
import { EmailProvider } from "@/lib/email-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { AuthProvider } from "@/lib/auth-context"
import { ChatProvider } from "@/lib/chat-context"
import SlideInCart from "@/components/slide-in-cart"
import ComparisonBar from "@/components/comparison-bar"
import ChatWidget from "@/components/chat-widget"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
})

export const metadata: Metadata = {
  title: "LNSC - Premium Laptops for Mindanao",
  description:
    "Discover cutting-edge laptop technology with branches across Zamboanga, Davao, CDO, and beyond. Your trusted tech partner in Mindanao.",
  keywords: "laptops, computers, technology, Mindanao, Zamboanga, Davao, CDO, gaming laptops, business laptops",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${pacifico.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="lnsc-theme">
          <Suspense fallback={null}>
            <AuthProvider>
              <SearchProvider>
                <ComparisonProvider>
                  <ReviewsProvider>
                    <EmailProvider>
                      <WishlistProvider>
                        <ChatProvider>
                          <CartProvider>
                            <Navbar />
                            <main className="pt-16 pb-20">{children}</main>
                            <SlideInCart />
                            <ComparisonBar />
                            <ChatWidget />
                          </CartProvider>
                        </ChatProvider>
                      </WishlistProvider>
                    </EmailProvider>
                  </ReviewsProvider>
                </ComparisonProvider>
              </SearchProvider>
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}