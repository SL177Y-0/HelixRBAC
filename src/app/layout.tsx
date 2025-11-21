import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import { Providers } from './providers'
import { cn } from '@/lib/utils'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata = {
  title: 'Helix | Command Your Empire',
  description: 'The next-generation RBAC dashboard for modern teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased selection:bg-primary/30 selection:text-primary-foreground",
        spaceGrotesk.variable
      )}>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
