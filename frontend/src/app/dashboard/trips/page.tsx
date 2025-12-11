"use client"

import * as React from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface Trip {
    _id: string
    origin: { address: string }
    stops: { address: string }[]
    startDate: string
    endDate: string
    groupSize: number
    status: string
    driver?: { name: string; phone: string }
}

export default function MyTripsPage() {
    const [trips, setTrips] = React.useState<Trip[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchTrips()
    }, [])

    async function fetchTrips() {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            const response = await fetch('/api/trips/user/' + user._id)

            if (response.ok) {
                const data = await response.json()
                setTrips(data)
            } else {
                toast.error("Failed to load trips")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading your trips...</div>
    }

    if (trips.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">You haven not requested any trips yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h1 className="text-3xl font-bold">My Trips</h1>
            <div className="grid gap-4">
                {trips.map((trip) => (
                    <Card key={trip._id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    {trip.origin.address} → {trip.stops[trip.stops.length - 1]?.address}
                                </CardTitle>
                                <Badge variant={
                                    trip.status === 'CONFIRMED' ? 'default' :
                                        trip.status === 'PENDING' ? 'secondary' :
                                            trip.status === 'COMPLETED' ? 'outline' :
                                                'destructive'
                                }>
                                    {trip.status}
                                </Badge>
                            </div>
                            <CardDescription>
                                {format(new Date(trip.startDate), "MMM dd, yyyy")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <p><strong>Group Size:</strong> {trip.groupSize} passengers</p>
                                {trip.driver && (
                                    <p><strong>Driver:</strong> {trip.driver.name || trip.driver.phone}</p>
                                )}
                                <p className="text-xs text-muted-foreground">Trip ID: {trip._id.slice(-8)}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
