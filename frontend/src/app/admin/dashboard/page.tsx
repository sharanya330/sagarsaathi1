import { Metadata } from "next"

import { DriverList } from "@/components/features/admin/DriverList"
import { SafetyMonitor } from "@/components/features/admin/SafetyMonitor"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
    title: "Admin Dashboard - SagarSaathi",
    description: "Administer the platform",
}

export default function AdminDashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            </div>
            <Tabs defaultValue="safety" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="safety">Safety Monitor</TabsTrigger>
                    <TabsTrigger value="drivers">Driver Vetting</TabsTrigger>
                </TabsList>
                <TabsContent value="safety" className="space-y-4">
                    <SafetyMonitor />
                </TabsContent>
                <TabsContent value="drivers" className="space-y-4">
                    <DriverList />
                </TabsContent>
            </Tabs>
        </div>
    )
}
