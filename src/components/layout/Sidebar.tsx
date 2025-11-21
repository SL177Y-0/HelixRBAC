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
    Shield
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"

const menuItems = {
    ADMIN: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Reports", href: "/dashboard/admin/reports", icon: PieChart },
        { label: "Audit Logs", href: "/dashboard/admin/audit", icon: Shield },
    ],
    MANAGER: [
        { label: "Projects", href: "/dashboard/manager/projects", icon: FolderKanban },
        { label: "Team Tasks", href: "/dashboard/manager/tasks", icon: CheckSquare },
    ],
    USER: [
        { label: "My Tasks", href: "/dashboard/user/tasks", icon: CheckSquare },
        { label: "Profile", href: "/dashboard/profile", icon: Settings },
    ],
}

export function Sidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()
    const userRole = (session?.user?.role as string) as keyof typeof menuItems || "USER"

    // Combine common items or just use role-based
    const items = menuItems[userRole] || []

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/60 backdrop-blur-xl transition-all duration-300">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-white/10 px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(57,255,20,0.3)] group-hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all duration-300">
                            H
                        </div>
                        <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                            HELIX
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {items.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                    isActive
                                        ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary shadow-[0_0_10px_rgba(57,255,20,0.5)]" />
                                )}
                                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                {/* User Profile & Logout */}
                <div className="border-t border-white/10 p-4">
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 border border-white/10 shadow-sm hover:border-primary/30 transition-colors duration-300">
                        <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs font-bold ring-2 ring-black">
                            {session?.user?.name?.[0] || "U"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {session?.user?.name || "User"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {userRole}
                            </p>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}
