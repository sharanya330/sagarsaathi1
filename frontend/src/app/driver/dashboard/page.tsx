import { Metadata } from "next"

import { DocumentUpload } from "@/components/features/driver/DocumentUpload"
import { TripQueue } from "@/components/features/driver/TripQueue"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActiveTripTracker } from "@/components/features/driver/ActiveTripTracker"

export const metadata: Metadata = {
    title: "Driver Dashboard - SagarSaathi",
    description: "Manage your trips and profile",
}

export default function DriverDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Driver Dashboard</h2>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-cyan-300">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                    Online
                </div>
            </div>

            {/* Driver Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Today's Earnings", value: "₹0", icon: "💰" },
                    { label: "Completed Trips", value: "0", icon: "✅" },
                    { label: "Hours Online", value: "0h", icon: "⏱️" },
                    { label: "Driver Rating", value: "5.0", icon: "⭐" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex items-center justify-between animate-float" style={{ animationDelay: `${i * 0.15}s` }}>
                        <div>
                            <p className="text-sm font-medium text-blue-200/60">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                        <div className="text-2xl">{stat.icon}</div>
                    </div>
                ))}
            </div>

            <Tabs defaultValue="queue" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 p-1 h-auto rounded-xl">
                    <TabsTrigger value="queue" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-blue-200/60 hover:text-white transition-all rounded-lg py-2 px-4">
                        Trip Queue
                    </TabsTrigger>
                    <TabsTrigger value="active" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-blue-200/60 hover:text-white transition-all rounded-lg py-2 px-4">
                        Active Trip
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-blue-200/60 hover:text-white transition-all rounded-lg py-2 px-4">
                        Documents
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="queue" className="space-y-4 glass-card p-6 border-white/10 bg-white/5">
                    <TripQueue />
                </TabsContent>
                <TabsContent value="active" className="space-y-4 glass-card p-6 border-white/10 bg-white/5">
                    <ActiveTripTracker />
                </TabsContent>
                <TabsContent value="documents" className="space-y-4 glass-card p-6 border-white/10 bg-white/5">
                    <DocumentUpload />
                </TabsContent>
            </Tabs>
        </div>
    )
}
