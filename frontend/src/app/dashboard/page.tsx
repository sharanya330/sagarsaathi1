import { Metadata } from "next"

import { TripRequestForm } from "@/components/features/trips/TripRequestForm"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Dashboard - SagarSaathi",
    description: "Manage your trips",
}

export default function DashboardPage() {
    return (
        <div className="grid items-start gap-8">
            <div className="flex items-center justify-between px-2">
                <div className="grid gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="text-lg text-blue-200/60">
                        Request a new trip or manage existing ones.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: "Total Trips", value: "0", icon: "🚗" },
                    { label: "Distance Traveled", value: "0 km", icon: "road" },

                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex items-center justify-between animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                        <div>
                            <p className="text-sm font-medium text-blue-200/60">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-xl">
                            {stat.icon === "road" ? <span className="text-cyan-400">🛣️</span> : stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Request a Trip</CardTitle>
                        <CardDescription className="text-blue-200/60">
                            Fill in the details below to request a new trip.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TripRequestForm />
                    </CardContent>
                </Card>
                <Card className="col-span-3 glass-card border-white/10 bg-white/5 text-white">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Trips</CardTitle>
                        <CardDescription className="text-blue-200/60">
                            Your recent trip history.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-blue-200/40 flex flex-col items-center justify-center h-40 border border-dashed border-white/10 rounded-lg">
                            <span className="text-2xl mb-2">🗺️</span>
                            No trips found.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
