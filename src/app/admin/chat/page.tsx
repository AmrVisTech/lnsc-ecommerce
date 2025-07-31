"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Users,
  Clock,
  Star,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ChatSession {
  id: string
  customerName: string
  customerAvatar: string
  department: string
  status: "waiting" | "active" | "ended"
  priority: "low" | "medium" | "high"
  startTime: Date
  lastMessage: string
  unreadCount: number
  tags: string[]
}

interface Agent {
  id: string
  name: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  activeSessions: number
  totalSessions: number
  avgResponseTime: string
  satisfaction: number
}

export default function AdminChatDashboard() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")

  // Mock data
  const sessions: ChatSession[] = [
    {
      id: "1",
      customerName: "John Doe",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=JD",
      department: "Technical Support",
      status: "active",
      priority: "high",
      startTime: new Date(Date.now() - 300000),
      lastMessage: "My laptop is not turning on",
      unreadCount: 2,
      tags: ["hardware", "urgent"],
    },
    {
      id: "2",
      customerName: "Jane Smith",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=JS",
      department: "Sales",
      status: "waiting",
      priority: "medium",
      startTime: new Date(Date.now() - 600000),
      lastMessage: "Looking for gaming laptops",
      unreadCount: 1,
      tags: ["sales", "gaming"],
    },
    {
      id: "3",
      customerName: "Mike Johnson",
      customerAvatar: "/placeholder.svg?height=40&width=40&text=MJ",
      department: "General Support",
      status: "active",
      priority: "low",
      startTime: new Date(Date.now() - 900000),
      lastMessage: "Thank you for your help!",
      unreadCount: 0,
      tags: ["resolved"],
    },
  ]

  const agents: Agent[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=SJ",
      status: "online",
      activeSessions: 3,
      totalSessions: 12,
      avgResponseTime: "1.2 min",
      satisfaction: 4.9,
    },
    {
      id: "2",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=MC",
      status: "online",
      activeSessions: 2,
      totalSessions: 8,
      avgResponseTime: "0.8 min",
      satisfaction: 4.8,
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
      status: "away",
      activeSessions: 1,
      totalSessions: 15,
      avgResponseTime: "2.1 min",
      satisfaction: 4.7,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
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

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chat Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer support conversations and agent performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waiting Queue</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Avg wait: 2.3 min</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">of 12 total agents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">+0.2 from last week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Sessions List */}
          <div className="lg:col-span-1">
            <Card className="h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Sessions</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 max-h-[500px] overflow-y-auto">
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                      className={cn(
                        "p-4 cursor-pointer border-l-4 transition-colors",
                        selectedSession === session.id
                          ? "bg-blue-50 dark:bg-blue-950 border-l-blue-500"
                          : "border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
                      )}
                      onClick={() => setSelectedSession(session.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={session.customerAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {session.customerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {session.status === "active" && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium truncate">{session.customerName}</h4>
                            <div className="flex items-center space-x-1">
                              <Badge className={cn("text-xs", getPriorityColor(session.priority))}>
                                {session.priority}
                              </Badge>
                              {session.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {session.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mb-1">{session.department}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{session.lastMessage}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(session.startTime)}</p>

                          {session.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {session.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {selectedSession ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40&text=JD" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">John Doe</h3>
                          <p className="text-sm text-gray-500">Technical Support • Online</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Transfer Chat</DropdownMenuItem>
                            <DropdownMenuItem>Add Tags</DropdownMenuItem>
                            <DropdownMenuItem>End Chat</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          My laptop is not turning on. I&apos;ve tried holding the power button but nothing happens.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">2:30 PM</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">
                          I understand your concern. Let&apos;s troubleshoot this step by step. First, can you check if the
                          power adapter is properly connected?
                        </p>
                        <p className="text-xs text-blue-100 mt-1">2:32 PM</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm">Yes, it&apos;s connected properly. The LED on the adapter is green.</p>
                        <p className="text-xs text-gray-500 mt-1">2:33 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a chat session</h3>
                    <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Agents Panel */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
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
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                          getStatusColor(agent.status),
                        )}
                      ></div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{agent.status}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Active: {agent.activeSessions}</span>
                        <span>Total: {agent.totalSessions}</span>
                        <span>Avg: {agent.avgResponseTime}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{agent.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}