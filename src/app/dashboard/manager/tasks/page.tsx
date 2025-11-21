"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, User, Calendar } from "lucide-react"

export default function TeamTasksPage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/tasks')
                if (res.ok) {
                    const data = await res.json()
                    setTasks(data.map((task: any) => ({
                        ...task,
                        assignee: task.assignee?.name || 'Unassigned',
                        due: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'
                    })))
                }
            } catch (error) {
                console.error("Failed to fetch tasks", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTasks()
    }, [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Team Tasks
                </h1>
                <p className="text-muted-foreground">
                    Oversee and assign tasks to your team members.
                </p>
            </div>

            <div className="grid gap-4">
                {tasks.map((task) => (
                    <Card key={task.id} className="glass-card hover:bg-white/5 transition-colors">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <CheckSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium">{task.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" /> {task.assignee}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" /> Due {task.due}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'
                                    }`}>
                                    {task.status}
                                </span>
                                <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
