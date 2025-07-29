import Link from "next/link"
import { Facebook, Instagram, MessageCircle, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="font-serif text-xl font-bold">LNSC</span>
            </div>
            <p className="text-gray-400 mb-4">
              Premium laptops for Mindanao. Your trusted technology partner since 2018.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/branches" className="text-gray-400 hover:text-white transition-colors">
                  Branches
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop?category=gaming" className="text-gray-400 hover:text-white transition-colors">
                  Gaming
                </Link>
              </li>
              <li>
                <Link href="/shop?category=work" className="text-gray-400 hover:text-white transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link href="/shop?category=student" className="text-gray-400 hover:text-white transition-colors">
                  Student
                </Link>
              </li>
              <li>
                <Link href="/shop?category=budget" className="text-gray-400 hover:text-white transition-colors">
                  Budget
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">+63 62 123 4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">info@lnsc.ph</span>
              </div>
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 LNSC. All rights reserved. | Proudly serving Mindanao</p>
        </div>
      </div>
    </footer>
  )
}