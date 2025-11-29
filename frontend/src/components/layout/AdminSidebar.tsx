import Link from "next/link"
import { Home, Users, ShieldAlert, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AdminSidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        SagarSaathi Admin
                    </h2>
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Drivers
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Safety Monitor
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
