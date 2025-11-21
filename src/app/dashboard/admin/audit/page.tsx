"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock } from "lucide-react"

export default function AuditLogsPage() {
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
                    <div className="divide-y divide-border/40">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                                <div className="h-8 w-8 rounded-full bg-muted/20 flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">User Updated Profile</p>
                                    <p className="text-xs text-muted-foreground">Admin User changed settings for User #{i}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" /> 2h ago
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
