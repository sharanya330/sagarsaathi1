import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Admin Dashboard - SagarSaathi",
    description: "Admin Dashboard Overview",
}

export default function AdminDashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-gray-200">Total Users</h3>
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <p className="text-xs text-gray-400">+0% from last month</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-gray-200">Total Drivers</h3>
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <p className="text-xs text-gray-400">+0% from last month</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-gray-200">Active Trips</h3>
                    </div>
                    <div className="text-2xl font-bold text-white">0</div>
                    <p className="text-xs text-gray-400">+0% from last hour</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-gray-200">Revenue</h3>
                    </div>
                    <div className="text-2xl font-bold text-white">₹0</div>
                    <p className="text-xs text-gray-400">+0% from last month</p>
                </div>
            </div>
        </div>
    )
}
