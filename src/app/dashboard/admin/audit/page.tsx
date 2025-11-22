"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, Loader2 } from "lucide-react"

interface AuditLog {
    id: string
    action: string
    entityType: string
    entityId: string
    performedBy: {
        name: string
        email: string
    }
    details: any
    createdAt: string
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/admin/audit-logs')
                if (res.ok) {
                    const data = await res.json()
                    setLogs(data.logs)
                }
            } catch (error) {
                console.error("Failed to fetch audit logs", error)
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [])

    const formatAction = (action: string) => {
        return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Audit Logs
                </h1>
                <p className="text-muted-foreground">
                    Track all system activities and security events.
                </p>
            </div>

            <Card className="glass-card">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No audit logs found.
                        </div>
                    ) : (
                        <div className="divide-y divide-border/40">
                            {logs.map((log) => (
                                <div key={log.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-muted/20 flex items-center justify-center">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{formatAction(log.action)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            <span className="font-semibold text-primary">{log.performedBy.name}</span> performed this action on {log.entityType.toLowerCase()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" /> {formatTime(log.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
