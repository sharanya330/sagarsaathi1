"use client"

import { usePathname } from "next/navigation"
import { Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { DriverSidebar } from "@/components/layout/DriverSidebar"

export function DashboardHeader() {
    const pathname = usePathname()
    const isDriver = pathname?.startsWith("/driver")

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
                            {isDriver ? <DriverSidebar /> : <DashboardSidebar />}
                        </SheetContent>
                    </Sheet>
                    <div className="font-bold text-white tracking-tight">
                        {isDriver ? "Driver Dashboard" : "Dashboard"}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-primary transition-colors">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
