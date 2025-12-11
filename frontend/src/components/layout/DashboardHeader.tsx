"use client"

import { usePathname, useRouter } from "next/navigation"
import { Menu, User, LogOut, Settings } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { DriverSidebar } from "@/components/layout/DriverSidebar"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
    const pathname = usePathname()
    const router = useRouter()
    const isDriver = pathname?.startsWith("/driver")
    const isAdmin = pathname?.startsWith("/admin")

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged out successfully")
        router.push(isAdmin ? "/admin/login" : "/login")
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/5 backdrop-blur-lg supports-[backdrop-filter]:bg-white/5">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-slate-950/95 border-white/10 w-72">
                            {isAdmin ? <AdminSidebar /> : isDriver ? <DriverSidebar /> : <DashboardSidebar />}
                        </SheetContent>
                    </Sheet>
                    <div className="font-bold text-white tracking-tight">
                        {isAdmin ? "Admin Dashboard" : isDriver ? "Driver Dashboard" : "Dashboard"}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 hover:text-primary transition-colors"
                        onClick={() => router.push(isAdmin ? '/admin/settings' : isDriver ? '/driver/dashboard/settings' : '/dashboard/profile')}
                    >
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
