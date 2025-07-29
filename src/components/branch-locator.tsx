"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { MapPin, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const branches = [
  {
    id: "zamboanga",
    name: "Zamboanga City",
    address: "Mayor Jaldon Street, Zamboanga City",
    phone: "+63 62 123 4567",
    hours: "Mon-Sat: 9AM-7PM",
    position: { x: 15, y: 75 },
  },
  {
    id: "davao",
    name: "Davao City",
    address: "Roxas Avenue, Davao City",
    phone: "+63 82 234 5678",
    hours: "Mon-Sat: 9AM-8PM",
    position: { x: 80, y: 70 },
  },
  {
    id: "cdo",
    name: "Cagayan de Oro",
    address: "Corrales Avenue, CDO",
    phone: "+63 88 345 6789",
    hours: "Mon-Sat: 9AM-7PM",
    position: { x: 70, y: 45 },
  },
  {
    id: "butuan",
    name: "Butuan City",
    address: "J.C. Aquino Avenue, Butuan",
    phone: "+63 85 456 7890",
    hours: "Mon-Sat: 9AM-6PM",
    position: { x: 75, y: 35 },
  },
]

export default function BranchLocator() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedBranch, setSelectedBranch] = useState(branches[0])

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Visit Our Branches
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience our products firsthand at any of our locations across Mindanao
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-8 h-96 relative overflow-hidden">
              {/* Simplified Mindanao outline */}
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 20 Q30 15 40 25 L60 30 Q80 35 85 50 L80 70 Q75 85 60 80 L40 75 Q25 70 20 50 Z"
                  fill="currentColor"
                  className="text-blue-200 dark:text-blue-800"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>

              {/* Branch markers */}
              {branches.map((branch, index) => (
                <motion.button
                  key={branch.id}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedBranch(branch)}
                  className={`absolute w-4 h-4 rounded-full transition-colors ${
                    selectedBranch.id === branch.id ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  style={{
                    left: `${branch.position.x}%`,
                    top: `${branch.position.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="sr-only">{branch.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Branch Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedBranch.name}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{selectedBranch.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{selectedBranch.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{selectedBranch.hours}</span>
                </div>
              </div>

              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">Get Directions</Button>
            </div>

            {/* Branch list */}
            <div className="grid grid-cols-2 gap-3">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedBranch.id === branch.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                      : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                  }`}
                >
                  <div className="font-medium text-sm">{branch.name}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}