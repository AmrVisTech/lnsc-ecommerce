/* eslint-disable @next/next/no-img-element */
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Paperclip, Smile, Phone, Video, MoreVertical, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChat } from "@/lib/chat-context"
import { cn } from "@/lib/utils"

export default function ChatWidget() {
  const {
    isOpen,
    setIsOpen,
    currentSession,
    messages,
    agents,
    isTyping,
    unreadCount,
    sendMessage,
    startChat,
    endChat,
    uploadFile,
    rateSatisfaction,
  } = useChat()

  const [inputValue, setInputValue] = useState("")
  const [showDepartments, setShowDepartments] = useState(false)
  const [showSatisfactionRating, setShowSatisfactionRating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const departments = [
    { id: "sales", name: "Sales", description: "Product inquiries and purchases" },
    { id: "technical", name: "Technical Support", description: "Technical issues and troubleshooting" },
    { id: "general", name: "General Support", description: "General questions and support" },
    { id: "billing", name: "Billing", description: "Payment and billing inquiries" },
  ]

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (inputValue.trim() && currentSession) {
      sendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const handleStartChat = (department: string) => {
    startChat(department)
    setShowDepartments(false)
  }

  const handleEndChat = () => {
    setShowSatisfactionRating(true)
  }

  const handleSatisfactionRating = (rating: number) => {
    rateSatisfaction(rating)
    setShowSatisfactionRating(false)
    endChat()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 relative"
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {unreadCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 w-[90%] sm:w-80 md:w-96 max-w-full h-[60vh] sm:h-[400px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-800 z-40 flex flex-col overflow-y-auto overflow-x-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32&text=LNSC" />
                    <AvatarFallback>LNSC</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">LNSC Support</h3>
                  <p className="text-xs opacity-90">
                    {currentSession?.status === "active"
                      ? "Connected"
                      : currentSession?.status === "waiting"
                        ? "Waiting for agent..."
                        : "Online"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-700">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-700">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-blue-700">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleEndChat}>End Chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Department Selection */}
            {!currentSession && (
              <div className="flex-1 p-4 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">How can we help you?</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Choose a department to get started</p>
                </div>

                <div className="space-y-3">
                  {departments.map((dept) => (
                    <Button
                      key={dept.id}
                      variant="outline"
                      className="w-full text-left h-auto p-4 flex flex-col items-start bg-transparent"
                      onClick={() => handleStartChat(dept.name)}
                    >
                      <span className="font-medium">{dept.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{dept.description}</span>
                    </Button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium mb-3">Available Agents</h4>
                  <div className="space-y-2">
                    {agents
                      .filter((agent) => agent.status === "online")
                      .map((agent) => (
                        <div key={agent.id} className="flex items-center space-x-3 text-sm">
                          <div className="relative">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {agent.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={cn(
                                "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white",
                                getStatusColor(agent.status),
                              )}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{agent.name}</p>
                            <p className="text-xs text-gray-500">{agent.department}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{agent.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">{agent.responseTime}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {currentSession && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3 text-sm",
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                        )}
                      >
                        {message.sender === "agent" && message.agentName && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={message.agentAvatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {message.agentName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{message.agentName}</span>
                          </div>
                        )}

                        {message.type === "image" ? (
                          <img
                            src={message.content || "/placeholder.svg"}
                            alt="Uploaded image"
                            className="rounded max-w-full"
                          />
                        ) : (
                          <p>{message.content}</p>
                        )}

                        <div
                          className={cn(
                            "text-xs mt-1 flex items-center justify-between",
                            message.sender === "user" ? "text-blue-100" : "text-gray-500",
                          )}
                        >
                          <span>{formatTime(message.timestamp)}</span>
                          {message.sender === "user" && (
                            <Badge variant="secondary" className="text-xs">
                              {message.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 w-8"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button onClick={handleSendMessage} disabled={!inputValue.trim()} size="icon" className="h-8 w-8">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Satisfaction Rating Modal */}
            {showSatisfactionRating && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm">
                  <h3 className="text-lg font-semibold mb-4 text-center">Rate Your Experience</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-6">
                    How satisfied were you with our support?
                  </p>

                  <div className="flex justify-center space-x-2 mb-6">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSatisfactionRating(rating)}
                        className="h-12 w-12"
                      >
                        <Star className="h-6 w-6 text-yellow-400 hover:fill-yellow-400" />
                      </Button>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => handleSatisfactionRating(0)} className="flex-1">
                      Skip
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx"
      />
    </>
  )
}