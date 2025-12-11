import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary/10 blur-[120px] animate-pulse-glow delay-1000 pointer-events-none" />

            <DashboardHeader />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 md:pt-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 relative z-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-white/10 md:sticky md:block">
                    <AdminSidebar />
                </aside>
                <main className="flex w-full flex-col overflow-hidden">{children}</main>
            </div>
        </div>
    )
}
