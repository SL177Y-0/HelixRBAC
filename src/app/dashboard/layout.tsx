"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
            <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
            <div 
                className={cn(
                    "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    isCollapsed ? "lg:pl-[100px]" : "lg:pl-[300px]"
                )}
            >
                <Navbar />
                <main className="flex-1 p-6 lg:p-8 pt-0 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    )
}
