"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CheckSquare, User, Calendar, Plus, Loader2 } from "lucide-react"

interface Task {
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    dueDate: string | null
    projectId: string
    assigneeId: string | null
    assignee: string
    due: string
}

interface Project {
    id: string
    name: string
}

interface User {
    id: string
    name: string
}

export default function TeamTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        projectId: "",
        assigneeId: "",
        dueDate: ""
    })

    const fetchData = async () => {
        try {
            const [tasksRes, projectsRes, usersRes] = await Promise.all([
                fetch('/api/tasks'),
                fetch('/api/projects'),
                fetch('/api/users')
            ])

            if (tasksRes.ok) {
                const data = await tasksRes.json()
                setTasks(data.map((task: any) => ({
                    ...task,
                    assignee: task.assignee?.name || 'Unassigned',
                    due: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'
                })))
            }

            if (projectsRes.ok) {
                const data = await projectsRes.json()
                setProjects(data)
            }

            if (usersRes.ok) {
                const data = await usersRes.json()
                setUsers(data)
            }

        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreate = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setIsCreateOpen(false)
                setFormData({
                    title: "",
                    description: "",
                    status: "TODO",
                    priority: "MEDIUM",
                    projectId: "",
                    assigneeId: "",
                    dueDate: ""
                })
                fetchData()
            }
        } catch (error) {
            console.error("Failed to create task", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Team Tasks
                    </h1>
                    <p className="text-muted-foreground">
                        Oversee and assign tasks to your team members.
                    </p>
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="premium" className="shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                            <DialogDescription>
                                Assign a new task to a team member.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input 
                                    id="title" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="Task title" 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea 
                                    id="description" 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Task description..." 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="project">Project</Label>
                                    <Select 
                                        value={formData.projectId} 
                                        onValueChange={(value) => setFormData({...formData, projectId: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {projects.map(project => (
                                                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="assignee">Assignee</Label>
                                    <Select 
                                        value={formData.assigneeId} 
                                        onValueChange={(value) => setFormData({...formData, assigneeId: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select assignee" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select 
                                        value={formData.priority} 
                                        onValueChange={(value) => setFormData({...formData, priority: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input 
                                        id="dueDate" 
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Task
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
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
            )}
        </div>
    )
}
