"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Activity, Loader2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        projectsCount: 0,
        activeTasksCount: 0,
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsRes, tasksRes] = await Promise.all([
                    fetch('/api/projects'),
                    fetch('/api/tasks')
                ])

                if (projectsRes.ok && tasksRes.ok) {
                    const projects = await projectsRes.json()
                    const tasks = await tasksRes.json()
                    setStats({
                        projectsCount: Array.isArray(projects) ? projects.length : 0,
                        activeTasksCount: Array.isArray(tasks) ? tasks.filter((t: any) => t.status !== 'DONE').length : 0,
                    })
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchData()
        }
    }, [session])

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Welcome back, {session?.user?.name?.split(' ')[0] || 'Commander'}
                </h1>
                <p className="text-muted-foreground text-lg">
                    Here's what's happening in your empire today.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="glass-card border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Projects
                        </CardTitle>
                        <Zap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">
                            {loading ? <Loader2 className="h-8 w-8 animate-spin text-primary/50" /> : stats.projectsCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active projects
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Active Tasks
                        </CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">
                            {loading ? <Loader2 className="h-8 w-8 animate-spin text-primary/50" /> : stats.activeTasksCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tasks in progress
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            System Status
                        </CardTitle>
                        <Shield className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">Optimal</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All systems operational
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks you perform</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button variant="premium" className="w-full justify-between group">
                            Create New Project
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between group hover:border-primary/50">
                            View Team Reports
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates from your team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                            No recent activity
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
