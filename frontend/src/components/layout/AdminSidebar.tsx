"use client"

import Link from "next/link"
import { Home, Users, Car, Settings, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AdminSidebar({ className }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        await signOut({ redirect: false })
        toast.success("Logged out successfully")
        router.push('/admin/login')
    }

    const isActive = (path: string) => pathname === path

    return (
        <div className={cn("pb-12 min-h-screen", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-bold tracking-tight text-white">
                        SagarSaathi Admin
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant={isActive('/admin/dashboard') ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", isActive('/admin/dashboard') ? "bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary" : "text-gray-400 hover:text-white hover:bg-white/10")}
                            onClick={() => router.push('/admin/dashboard')}
                        >
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button
                            variant={isActive('/admin/users') ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", isActive('/admin/users') ? "bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary" : "text-gray-400 hover:text-white hover:bg-white/10")}
                            onClick={() => router.push('/admin/users')}
                        >
                            <Users className="mr-2 h-4 w-4" />
                            Users
                        </Button>
                        <Button
                            variant={isActive('/admin/drivers') ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", isActive('/admin/drivers') ? "bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary" : "text-gray-400 hover:text-white hover:bg-white/10")}
                            onClick={() => router.push('/admin/drivers')}
                        >
                            <Car className="mr-2 h-4 w-4" />
                            Drivers
                        </Button>
                        <Button
                            variant={isActive('/admin/settings') ? "secondary" : "ghost"}
                            className={cn("w-full justify-start", isActive('/admin/settings') ? "bg-primary/20 text-primary hover:bg-primary/30 hover:text-primary" : "text-gray-400 hover:text-white hover:bg-white/10")}
                            onClick={() => router.push('/admin/settings')}
                        >
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
