"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEmail, type EmailNotification } from "@/lib/email-context"

export default function EmailHistory() {
  const { notifications, resendNotification, cancelScheduledEmail, isLoading } = useEmail()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null)

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.to.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesType = typeFilter === "all" || notification.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: EmailNotification["status"]) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "scheduled":
        return <Calendar className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: EmailNotification["status"]) => {
    const variants = {
      sent: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    }

    return (
      <Badge className={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </Badge>
    )
  }

  const getTypeIcon = (type: EmailNotification["type"]) => {
    switch (type) {
      case "order":
        return "🛍️"
      case "review":
        return "⭐"
      case "promotion":
        return "🔥"
      case "system":
        return "⚙️"
      default:
        return "📧"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleResend = async (notificationId: string) => {
    await resendNotification(notificationId)
  }

  const handleCancel = async (notificationId: string) => {
    if (window.confirm("Are you sure you want to cancel this scheduled email?")) {
      await cancelScheduledEmail(notificationId)
    }
  }

  // Statistics
  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === "sent").length,
    failed: notifications.filter((n) => n.status === "failed").length,
    scheduled: notifications.filter((n) => n.status === "scheduled").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Email History</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage your email notifications</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Total Emails</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.sent}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Sent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failed}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.scheduled}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="promotion">Promotions</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white mb-2">No emails found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Email notifications will appear here"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">{notification.subject}</h3>
                          {getStatusBadge(notification.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">To: {notification.to}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Created: {formatDate(notification.createdAt)}</span>
                          {notification.sentAt && <span>Sent: {formatDate(notification.sentAt)}</span>}
                          {notification.scheduledFor && <span>Scheduled: {formatDate(notification.scheduledFor)}</span>}
                          {notification.retryCount > 0 && <span>Retries: {notification.retryCount}</span>}
                        </div>
                        {notification.error && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2">Error: {notification.error}</p>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedEmail(notification)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {notification.status === "failed" && (
                          <DropdownMenuItem onClick={() => handleResend(notification.id)}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Resend
                          </DropdownMenuItem>
                        )}
                        {notification.status === "scheduled" && (
                          <DropdownMenuItem
                            onClick={() => handleCancel(notification.id)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white">Email Details</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{selectedEmail.subject}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEmail(null)}>
                ×
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedEmail.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</Label>
                    <div className="mt-1 capitalize">{selectedEmail.type}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Recipient</Label>
                  <div className="mt-1">{selectedEmail.to}</div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Template</Label>
                  <div className="mt-1">{selectedEmail.template}</div>
                </div>

                {selectedEmail.variables && Object.keys(selectedEmail.variables).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Variables</Label>
                    <div className="mt-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {JSON.stringify(selectedEmail.variables, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedEmail.error && (
                  <div>
                    <Label className="text-sm font-medium text-red-500">Error</Label>
                    <div className="mt-1 text-red-600 dark:text-red-400">{selectedEmail.error}</div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</Label>
                    <div className="mt-1">{formatDate(selectedEmail.createdAt)}</div>
                  </div>
                  {selectedEmail.sentAt && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Sent</Label>
                      <div className="mt-1">{formatDate(selectedEmail.sentAt)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}