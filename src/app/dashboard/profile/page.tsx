"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Shield, Key, Loader2 } from "lucide-react"

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [name, setName] = useState(session?.user?.name || "")
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })

    const handleUpdateProfile = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/users/${session?.user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            })
            if (res.ok) { await update({ name }); alert("Profile updated successfully") }
            else { alert("Failed to update profile") }
        } catch (error) { console.error(error); alert("An error occurred") }
        finally { setIsSubmitting(false) }
    }

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) { alert("Passwords do not match"); return }
        setIsSubmitting(true)
        try {
            const res = await fetch(`/api/users/${session?.user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordData.newPassword })
            })
            if (res.ok) { setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); alert("Password updated successfully") }
            else { alert("Failed to update password") }
        } catch (error) { console.error(error); alert("An error occurred") }
        finally { setIsSubmitting(false) }
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div><h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Profile Settings</h1><p className="text-muted-foreground">Manage your account settings and preferences.</p></div>
            <div className="grid gap-6">
                <Card className="glass-card">
                    <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your personal details.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 mb-6"><div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/20">{session?.user?.name?.[0] || "U"}</div></div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2"><label className="text-sm font-medium">Full Name</label><div className="relative"><User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9" /></div></div>
                            <div className="space-y-2"><label className="text-sm font-medium">Email</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input defaultValue={session?.user?.email || ""} className="pl-9" disabled /></div></div>
                            <div className="space-y-2"><label className="text-sm font-medium">Role</label><div className="relative"><Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input defaultValue={session?.user?.role || "USER"} className="pl-9" disabled /></div></div>
                        </div>
                        <div className="pt-4"><Button onClick={handleUpdateProfile} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save Changes</Button></div>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader><CardTitle>Security</CardTitle><CardDescription>Manage your password and security settings.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><label className="text-sm font-medium">Current Password</label><div className="relative"><Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="••••••••" className="pl-9" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} /></div></div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2"><label className="text-sm font-medium">New Password</label><Input type="password" placeholder="••••••••" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} /></div>
                            <div className="space-y-2"><label className="text-sm font-medium">Confirm Password</label><Input type="password" placeholder="••••••••" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} /></div>
                        </div>
                        <div className="pt-4"><Button variant="premium" onClick={handleUpdatePassword} disabled={isSubmitting || !passwordData.newPassword}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Update Password</Button></div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
