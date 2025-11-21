import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
                <Navbar />
                <main className="flex-1 p-6 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    )
}
