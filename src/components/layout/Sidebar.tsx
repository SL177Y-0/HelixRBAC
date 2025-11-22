"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    CheckSquare,
    Settings,
    LogOut,
    PieChart,
    Shield,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const menuItems = {
    ADMIN: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Reports", href: "/dashboard/admin/reports", icon: PieChart },
        { label: "Audit Logs", href: "/dashboard/admin/audit", icon: Shield },
    ],
    MANAGER: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Projects", href: "/dashboard/manager/projects", icon: FolderKanban },
        { label: "Team Tasks", href: "/dashboard/manager/tasks", icon: CheckSquare },
    ],
    USER: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "My Tasks", href: "/dashboard/user/tasks", icon: CheckSquare },
        { label: "Profile", href: "/dashboard/profile", icon: Settings },
    ],
}

interface SidebarProps {
    isCollapsed?: boolean
    toggleCollapse?: () => void
}

export function Sidebar({ isCollapsed = false, toggleCollapse }: SidebarProps) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const userRole = (session?.user?.role as string) as keyof typeof menuItems || "USER"
    const items = menuItems[userRole] || []

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isCollapsed ? 80 : 280,
                transition: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="fixed left-4 top-4 bottom-4 z-40 flex flex-col rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 font-bold text-xl tracking-tight"
                        >
                            <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                                H
                            </div>
                            <span className="text-foreground">HELIX</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {toggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleCollapse}
                        className={cn("ml-auto hover:bg-white/5", isCollapsed && "mx-auto")}
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-3 py-6">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                isActive
                                    ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                                    : "text-muted-foreground hover:text-primary hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                />
                            )}
                            <Icon className={cn("h-5 w-5 min-w-[20px] transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="border-t border-white/5 p-4">
                <div className={cn("flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/5 transition-all duration-300", isCollapsed ? "justify-center" : "")}>
                    <div className="h-9 w-9 min-w-[36px] rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs font-bold ring-2 ring-black/50">
                        {session?.user?.name?.[0] || "U"}
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="flex-1 overflow-hidden"
                            >
                                <p className="truncate text-sm font-medium text-foreground">
                                    {session?.user?.name || "User"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {userRole}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!isCollapsed && (
                        <button
                            onClick={() => signOut()}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </motion.aside>
    )
}
