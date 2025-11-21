"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, MoreVertical, FolderKanban } from "lucide-react"

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects')
                if (res.ok) {
                    const data = await res.json()
                    setProjects(data.map((project: any) => ({
                        ...project,
                        progress: Math.floor(Math.random() * 100), // Mock progress for now as it's not in schema
                        tasks: project.tasks?.length || 0,
                        dueDate: project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'
                    })))
                }
            } catch (error) {
                console.error("Failed to fetch projects", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjects()
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Projects
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and track all ongoing initiatives.
                    </p>
                </div>
                <Button variant="premium" className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="pl-9 bg-background/50"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="glass-card group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <FolderKanban className="h-5 w-5" />
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardTitle className="mt-4">{project.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" /> Due {project.dueDate}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{project.progress}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="px-2.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium">
                                        {project.tasks} Tasks
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                                            project.status === 'Planning' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
