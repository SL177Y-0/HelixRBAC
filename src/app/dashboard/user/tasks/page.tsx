"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare, Clock, AlertCircle } from "lucide-react"

export default function UserTasksPage() {
    const [tasks] = useState([
        { id: 1, title: "Update User Documentation", priority: "High", due: "Today", status: "TODO" },
        { id: 2, title: "Fix Navigation Bug", priority: "Medium", due: "Tomorrow", status: "IN_PROGRESS" },
        { id: 3, title: "Review Pull Requests", priority: "Low", due: "Next Week", status: "DONE" },
    ])

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
                      ${task.priority === 'High' ? 'text-red-500' : 'text-muted-foreground'}
                    `}>
                                            {task.priority} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Button variant={task.status === 'DONE' ? "outline" : "default"} size="sm">
                                {task.status === 'DONE' ? 'Completed' : 'Mark Complete'}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
