import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
            <h1 className="text-9xl font-bold text-primary/20">404</h1>
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-muted-foreground">The page you are looking for does not exist or has been moved.</p>
            <Button asChild variant="premium">
                <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
        </div>
    )
}
