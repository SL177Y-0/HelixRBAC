"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-black/60 px-6 backdrop-blur-xl transition-all">
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10 hover:text-primary">
                <Menu className="h-5 w-5" />
            </Button>

            <div className="flex flex-1 items-center gap-4 md:gap-8">
                <div className="relative flex-1 md:w-96 md:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search anything..."
                        className="h-9 w-full rounded-full bg-white/5 border-white/10 pl-9 md:w-96 focus:bg-black/40 focus:border-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-primary/10 hover:text-primary">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(57,255,20,0.5)]" />
                </Button>
            </div>
        </header>
    )
}
