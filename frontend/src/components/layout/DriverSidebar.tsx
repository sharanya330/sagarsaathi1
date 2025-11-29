import Link from "next/link"
import { Home, List, FileText, Settings, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DriverSidebar({ className }: SidebarProps) {
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
            </div>
        </div>
    )
}
