"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, PieChart, Activity } from "lucide-react"

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    System Reports
                </h1>
                <p className="text-muted-foreground">
                    Analytics and insights for your organization.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card h-96 flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                            <BarChart className="h-8 w-8" />
                        </div>
                        <p>User Activity Chart Placeholder</p>
                    </div>
                </Card>
                <Card className="glass-card h-96 flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-4">
                        <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                            <PieChart className="h-8 w-8" />
                        </div>
                        <p>Project Distribution Placeholder</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}
