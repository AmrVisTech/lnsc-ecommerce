"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Settings, History } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmailPreferences from "@/components/email-preferences"
import EmailHistory from "@/components/email-history"

export default function EmailSettingsPage() {
  const [activeTab, setActiveTab] = useState("preferences")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Email Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your email preferences and view notification history
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 mb-8">
              <TabsTrigger value="preferences" className="gap-2">
                <Settings className="w-4 h-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences">
              <EmailPreferences />
            </TabsContent>

            <TabsContent value="history">
              <EmailHistory />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}