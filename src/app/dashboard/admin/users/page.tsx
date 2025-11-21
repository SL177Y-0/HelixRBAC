"use client"

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, MoreVertical, Shield, Mail, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserData {
    id: string
    name: string
    email: string
    role: string
    status: string
    lastActive: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users')
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data.map((user: any) => ({
                        ...user,
                        status: user.isActive ? 'Active' : 'Inactive',
                        lastActive: new Date(user.createdAt).toLocaleDateString() // Fallback for now
                    })))
                }
            } catch (error) {
                console.error("Failed to fetch users", error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage access and permissions for your team.
                    </p>
                </div>
                <Button variant="premium" className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add New User
                </Button>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>A list of all users in your organization.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search users..."
                                className="pl-9 bg-background/50"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-muted/50" />
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary font-bold text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{user.name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                                                user.role === 'ADMIN' ? "bg-primary/10 text-primary border-primary/20" :
                                                    user.role === 'MANAGER' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                        "bg-slate-500/10 text-slate-500 border-slate-500/20"
                                            )}>
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-2 w-2 rounded-full animate-pulse",
                                                    user.status === 'Active' ? "bg-green-500" : "bg-slate-500"
                                                )} />
                                                <span className="text-sm text-muted-foreground">{user.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {user.lastActive}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
