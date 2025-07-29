"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, MapPin, Users, Award } from "lucide-react"

const milestones = [
  {
    year: "2018",
    title: "The Beginning",
    description: "LNSC was founded in Zamboanga City with a vision to bring premium technology to Mindanao",
    icon: Calendar,
    color: "from-blue-600 to-indigo-600",
  },
  {
    year: "2019",
    title: "First Expansion",
    description: "Opened our second branch in Davao City, serving the growing tech community",
    icon: MapPin,
    color: "from-green-600 to-teal-600",
  },
  {
    year: "2020",
    title: "Digital Transformation",
    description: "Launched online platform and contactless services during the pandemic",
    icon: Users,
    color: "from-purple-600 to-pink-600",
  },
  {
    year: "2021",
    title: "Regional Growth",
    description: "Expanded to Cagayan de Oro and Butuan, becoming Mindanao's trusted laptop retailer",
    icon: Award,
    color: "from-orange-600 to-red-600",
  },
]

export default function CompanyTimeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 dark:from-black dark:via-gray-900 dark:to-blue-900 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-white rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">Our Journey</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From a single store to Mindanao&apos;s premier laptop retailer
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-400 rounded-full" />

          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div
                      className={`text-2xl font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent mb-2`}
                    >
                      {milestone.year}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-3">{milestone.title}</h3>
                    <p className="text-gray-300">{milestone.description}</p>
                  </div>
                </div>

                {/* Timeline node */}
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className={`w-16 h-16 bg-gradient-to-r ${milestone.color} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <milestone.icon className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quote section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <blockquote className="font-serif text-2xl md:text-3xl text-white italic max-w-4xl mx-auto">
            &quot;Empowering Mindanao with cutting-edge technology, one laptop at a time.&quot;
          </blockquote>
          <cite className="block mt-4 text-gray-300 font-pacifico text-lg">- LNSC Team</cite>
        </motion.div>
      </div>
    </section>
  )
}