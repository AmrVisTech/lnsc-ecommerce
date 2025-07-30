import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { WishlistProvider } from "@/lib/wishlist-context"
import { ReviewsProvider } from "@/lib/reviews-context"
import { EmailProvider } from "@/lib/email-context"
import { ComparisonProvider } from "@/lib/comparison-context"
import { CartProvider } from "@/lib/cart-context"
import { SearchProvider } from "@/lib/search-context"
import { ThemeProvider } from "@/lib/theme-context"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import SlideInCart from "@/components/SlideInCart"
import ComparisonBar from "@/components/ComparisonBar"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <WishlistProvider>
          <ReviewsProvider>
            <EmailProvider>
              <ComparisonProvider>
                <CartProvider>
                  <SearchProvider>
                    <ThemeProvider>
                      <div className="min-h-screen bg-background">
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                        <SlideInCart />
                        <ComparisonBar />
                      </div>
                    </ThemeProvider>
                  </SearchProvider>
                </CartProvider>
              </ComparisonProvider>
            </EmailProvider>
          </ReviewsProvider>
        </WishlistProvider>
      </body>
    </html>
  )
}