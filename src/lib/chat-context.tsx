"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  agentName?: string
  agentAvatar?: string
  type: "text" | "image" | "file"
  status: "sending" | "sent" | "delivered" | "read"
}

export interface ChatAgent {
  id: string
  name: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  department: string
  rating: number
  responseTime: string
}

export interface ChatSession {
  id: string
  userId: string
  agentId?: string
  status: "waiting" | "active" | "ended"
  startTime: Date
  endTime?: Date
  messages: ChatMessage[]
  department: string
  priority: "low" | "medium" | "high"
  satisfaction?: number
  tags: string[]
}

interface ChatContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  currentSession: ChatSession | null
  messages: ChatMessage[]
  agents: ChatAgent[]
  isTyping: boolean
  unreadCount: number
  sendMessage: (content: string, type?: "text" | "image" | "file") => void
  startChat: (department: string) => void
  endChat: () => void
  markAsRead: () => void
  uploadFile: (file: File) => Promise<void>
  rateSatisfaction: (rating: number) => void
  addTags: (tags: string[]) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Mock agents data
  const [agents] = useState<ChatAgent[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      status: "online",
      department: "Technical Support",
      rating: 4.9,
      responseTime: "< 2 min",
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      status: "online",
      department: "Sales",
      rating: 4.8,
      responseTime: "< 1 min",
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
      status: "away",
      department: "General Support",
      rating: 4.7,
      responseTime: "< 3 min",
    },
  ])

  // Load chat data from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("chat-session")
    const savedMessages = localStorage.getItem("chat-messages")
    const savedUnreadCount = localStorage.getItem("chat-unread-count")

    if (savedSession) {
      const session = JSON.parse(savedSession)
      session.startTime = new Date(session.startTime)
      if (session.endTime) session.endTime = new Date(session.endTime)
      setCurrentSession(session)
    }

    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      parsedMessages.forEach((msg: ChatMessage) => {
        msg.timestamp = new Date(msg.timestamp)
      })
      setMessages(parsedMessages)
    }

    if (savedUnreadCount) {
      setUnreadCount(Number.parseInt(savedUnreadCount))
    }
  }, [])

  // Save chat data to localStorage
  useEffect(() => {
    if (currentSession) {
      localStorage.setItem("chat-session", JSON.stringify(currentSession))
    }
  }, [currentSession])

  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem("chat-unread-count", unreadCount.toString())
  }, [unreadCount])

  const startChat = useCallback(
    (department: string) => {
      const availableAgent =
        agents.find((agent) => agent.department === department && agent.status === "online") ||
        agents.find((agent) => agent.status === "online")

      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        userId: "user-1", // In real app, get from auth context
        agentId: availableAgent?.id,
        status: availableAgent ? "active" : "waiting",
        startTime: new Date(),
        messages: [],
        department,
        priority: "medium",
        tags: [],
      }

      setCurrentSession(newSession)
      setMessages([])

      // Simulate agent greeting
      if (availableAgent) {
        setTimeout(() => {
          const greetingMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            content: `Hi! I'm ${availableAgent.name} from ${department}. How can I help you today?`,
            sender: "agent",
            timestamp: new Date(),
            agentName: availableAgent.name,
            agentAvatar: availableAgent.avatar,
            type: "text",
            status: "sent",
          }
          setMessages((prev) => [...prev, greetingMessage])
          if (!isOpen) {
            setUnreadCount((prev) => prev + 1)
          }
        }, 1000)
      }
    },
    [agents, isOpen],
  )

  const sendMessage = useCallback(
    (content: string, type: "text" | "image" | "file" = "text") => {
      if (!currentSession) return

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content,
        sender: "user",
        timestamp: new Date(),
        type,
        status: "sending",
      }

      setMessages((prev) => [...prev, newMessage])

      // Simulate message delivery
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" as const } : msg)),
        )
      }, 500)

      // Simulate agent typing and response
      if (currentSession.status === "active") {
        setIsTyping(true)

        setTimeout(
          () => {
            setIsTyping(false)
            const agent = agents.find((a) => a.id === currentSession.agentId)

            const responses = [
              "I understand your concern. Let me help you with that.",
              "That's a great question! Here's what I can tell you...",
              "I'll look into this for you right away.",
              "Thanks for providing that information. Let me check our system.",
              "I can definitely help you with that. Give me just a moment.",
            ]

            const agentResponse: ChatMessage = {
              id: `msg-${Date.now()}`,
              content: responses[Math.floor(Math.random() * responses.length)],
              sender: "agent",
              timestamp: new Date(),
              agentName: agent?.name,
              agentAvatar: agent?.avatar,
              type: "text",
              status: "sent",
            }

            setMessages((prev) => [...prev, agentResponse])
            if (!isOpen) {
              setUnreadCount((prev) => prev + 1)
            }
          },
          2000 + Math.random() * 3000,
        )
      }
    },
    [currentSession, agents, isOpen],
  )

  const endChat = useCallback(() => {
    if (currentSession) {
      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              status: "ended",
              endTime: new Date(),
            }
          : null,
      )
    }
  }, [currentSession])

  const markAsRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      // Simulate file upload
      const fileUrl = URL.createObjectURL(file)
      sendMessage(fileUrl, file.type.startsWith("image/") ? "image" : "file")
    },
    [sendMessage],
  )

  const rateSatisfaction = useCallback(
    (rating: number) => {
      if (currentSession) {
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                satisfaction: rating,
              }
            : null,
        )
      }
    },
    [currentSession],
  )

  const addTags = useCallback(
    (tags: string[]) => {
      if (currentSession) {
        setCurrentSession((prev) =>
          prev
            ? {
                ...prev,
                tags: [...prev.tags, ...tags],
              }
            : null,
        )
      }
    },
    [currentSession],
  )

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen) {
      markAsRead()
    }
  }, [isOpen, markAsRead])

  return (
    <ChatContext.Provider
      value={{
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
        markAsRead,
        uploadFile,
        rateSatisfaction,
        addTags,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}