"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Notification {
    id: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
}

export function Navbar() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications')
            if (res.ok) {
                const data = await res.json()
                setNotifications(data.notifications)
                setUnreadCount(data.unreadCount)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000)
        return () => clearInterval(interval)
    }, [])

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: id })
            })
            if (res.ok) {
                fetchNotifications()
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleMarkAllAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent dropdown closing immediately
        try {
            const res = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllAsRead: true })
            })
            if (res.ok) {
                fetchNotifications()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <header className="sticky top-4 z-30 mx-6 mb-6 flex h-16 items-center gap-4 rounded-2xl border border-white/10 bg-black/60 px-6 backdrop-blur-xl shadow-lg transition-all">
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-white/5 hover:text-primary">
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex flex-1 items-center gap-4 md:gap-8">
                <div className="relative flex-1 md:w-96 md:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search anything..."
                        className="h-10 w-full rounded-xl bg-white/5 border-white/10 pl-10 md:w-96 focus:bg-black/40 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-white/5 hover:text-primary transition-colors">
                            <Bell className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" onClick={handleMarkAllAsRead}>
                                    Mark all as read
                                </Button>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No notifications
                            </div>
                        ) : (
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((notification) => (
                                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer" onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}>
                                        <div className="flex w-full items-start justify-between gap-2">
                                            <span className={cn("font-medium", !notification.isRead && "text-primary")}>
                                                {notification.title}
                                            </span>
                                            {!notification.isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground/50">
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
