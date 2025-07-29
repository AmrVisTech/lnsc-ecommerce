"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const categories = [
  {
    id: "gaming",
    title: "Gaming Powerhouse",
    description: "High-performance laptops for serious gamers",
    image: "/placeholder.svg?height=400&width=600&text=Gaming+Laptop",
    color: "from-red-600 to-orange-600",
    cta: "Level Up Now",
  },
  {
    id: "work",
    title: "Professional Workspace",
    description: "Reliable machines for business and productivity",
    image: "/placeholder.svg?height=400&width=600&text=Business+Laptop",
    color: "from-blue-600 to-indigo-600",
    cta: "Boost Productivity",
  },
  {
    id: "student",
    title: "Student Essential",
    description: "Perfect balance of performance and affordability",
    image: "/placeholder.svg?height=400&width=600&text=Student+Laptop",
    color: "from-green-600 to-teal-600",
    cta: "Study Smart",
  },
  {
    id: "budget",
    title: "Budget Friendly",
    description: "Quality laptops that won't break the bank",
    image: "/placeholder.svg?height=400&width=600&text=Budget+Laptop",
    color: "from-purple-600 to-pink-600",
    cta: "Save More",
  },
]

export default function ProductCategories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Match
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            From gaming beasts to budget-friendly options, we have the right laptop for every need
          </p>
        </motion.div>

        <div className="space-y-32">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-12`}
            >
              {/* Image side */}
              <div className="flex-1 relative">
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 rounded-2xl blur-xl`}
                  />
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    width={600}
                    height={400}
                    className="relative z-10 rounded-2xl shadow-2xl"
                  />
                </motion.div>

                {/* Floating elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r ${category.color} rounded-full opacity-60`}
                />
              </div>

              {/* Content side */}
              <div className="flex-1 text-center lg:text-left">
                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  {category.title}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                  className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto lg:mx-0"
                >
                  {category.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                >
                  <Link href={`/shop?category=${category.id}`}>
                    <Button
                      size="lg"
                      className={`bg-gradient-to-r ${category.color} hover:opacity-90 text-white font-pacifico`}
                    >
                      {category.cta}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}