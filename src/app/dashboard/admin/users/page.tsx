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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Plus, Search, MoreVertical, Shield, Mail, User, Loader2, Edit, Trash2, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { exportToCSV } from "@/lib/export-utils"

interface UserData {
    id: string
    name: string
    email: string
    role: string
    status: string
    lastActive: string
    isActive: boolean
    department?: string
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    
    // Edit State
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)
    const [editFormData, setEditFormData] = useState({
        role: "",
        isActive: true
    })

    // Add State
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [addFormData, setAddFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
        department: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

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

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleAdd = async () => {
        if (!addFormData.name || !addFormData.email || !addFormData.password) {
            alert("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addFormData)
            })

            if (res.ok) {
                setIsAddOpen(false)
                setAddFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "USER",
                    department: ""
                })
                fetchUsers()
            } else {
                const error = await res.text()
                alert(error)
            }
        } catch (error) {
            console.error("Failed to create user", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdate = async () => {
        if (!currentUser) return
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/users/${currentUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: editFormData.role,
                    isActive: editFormData.isActive
                })
            })

            if (res.ok) {
                setIsEditOpen(false)
                setCurrentUser(null)
                fetchUsers()
            }
        } catch (error) {
            console.error("Failed to update user", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleExport = () => {
        const data = users.map(u => ({
            Name: u.name,
            Email: u.email,
            Role: u.role,
            Status: u.isActive ? 'Active' : 'Inactive',
            Department: u.department || 'N/A',
            Joined: new Date(u.lastActive).toLocaleDateString()
        }))
        exportToCSV(data, 'users-list')
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                fetchUsers()
            } else {
                const error = await res.text()
                alert(error)
            }
        } catch (error) {
            console.error("Failed to delete user", error)
        }
    }

    const openEditDialog = (user: UserData) => {
        setCurrentUser(user)
        setEditFormData({
            role: user.role,
            isActive: user.isActive
        })
        setIsEditOpen(true)
    }

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button variant="premium" className="shadow-lg shadow-primary/20">
                                <Plus className="mr-2 h-4 w-4" /> Add New User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>
                                    Add a new user to your organization. They will receive an email to set their password.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input 
                                        id="name" 
                                        value={addFormData.name}
                                        onChange={(e) => setAddFormData({...addFormData, name: e.target.value})}
                                        placeholder="John Doe" 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input 
                                        id="email" 
                                        type="email"
                                        value={addFormData.email}
                                        onChange={(e) => setAddFormData({...addFormData, email: e.target.value})}
                                        placeholder="john@example.com" 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Initial Password</Label>
                                    <Input 
                                        id="password" 
                                        type="password"
                                        value={addFormData.password}
                                        onChange={(e) => setAddFormData({...addFormData, password: e.target.value})}
                                        placeholder="••••••••" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select 
                                            value={addFormData.role} 
                                            onValueChange={(value) => setAddFormData({...addFormData, role: value})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="MANAGER">Manager</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department (Optional)</Label>
                                        <Input 
                                            id="department" 
                                            value={addFormData.department}
                                            onChange={(e) => setAddFormData({...addFormData, department: e.target.value})}
                                            placeholder="Engineering" 
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button onClick={handleAdd} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create User
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        A list of all users in your organization including their name, role, and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Role/Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update role and status for {currentUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select 
                                value={editFormData.role} 
                                onValueChange={(value) => setEditFormData({...editFormData, role: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">User</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select 
                                value={editFormData.isActive ? "true" : "false"} 
                                onValueChange={(value) => setEditFormData({...editFormData, isActive: value === "true"})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
