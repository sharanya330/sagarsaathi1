use client

import Link from "next/link"
import { Home, Map, User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DriverSidebar({ className }: SidebarProps) {
    const router = useRouter()

    const handleLogout = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        await signOut({ redirect: false })
        toast.success("Logged out successfully")
        router.push('/driver/login')
    }

    return (
        <div className={cn("pb-12 min-h-screen", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-bold tracking-tight text-white">
                        SagarSaathi Driver
                    </h2>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary font-medium">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <List className="mr-2 h-4 w-4" />
                            Trip Queue
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <FileText className="mr-2 h-4 w-4" />
                            Documents
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                </div>
                <div className="px-3 py-2 mt-auto">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}
