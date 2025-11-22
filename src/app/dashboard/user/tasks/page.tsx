"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Clock, AlertCircle, Loader2 } from "lucide-react"

interface Task {
    id: string
    title: string
    priority: string
    dueDate: string | null
    status: string
    due: string
}

export default function UserTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTasks = async () => {
        try {
            const res = await fetch('/api/tasks')
            if (res.ok) {
                const data = await res.json()
                setTasks(data.map((task: any) => ({
                    ...task,
                    due: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'
                })))
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleStatusUpdate = async (taskId: string, currentStatus: string) => {
        let newStatus = 'TODO'
        if (currentStatus === 'TODO') newStatus = 'IN_PROGRESS'
        else if (currentStatus === 'IN_PROGRESS') newStatus = 'DONE'
        else if (currentStatus === 'DONE') newStatus = 'TODO' // Optional: allow reopening

        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                fetchTasks()
            }
        } catch (error) {
            console.error("Failed to update task status", error)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    My Tasks
                </h1>
                <p className="text-muted-foreground">
                    Stay on top of your assigned work.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                    No tasks assigned to you yet.
                </div>
            ) : (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <Card key={task.id} className="glass-card hover:bg-white/5 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${task.status === 'TODO' ? 'bg-slate-500/10 text-slate-500' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-green-500/10 text-green-500'
                                        }`}>
                                        <CheckSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{task.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <Clock className="h-3 w-3" /> Due {task.due}
                                            <span className="mx-1">•</span>
                                            <span className={`
                          ${task.priority === 'HIGH' ? 'text-red-500' : 'text-muted-foreground'}
                        `}>
                                                {task.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    variant={task.status === 'DONE' ? "outline" : "default"} 
                                    size="sm"
                                    onClick={() => handleStatusUpdate(task.id, task.status)}
                                >
                                    {task.status === 'DONE' ? 'Completed' : 
                                     task.status === 'IN_PROGRESS' ? 'Mark Done' : 'Start Task'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
