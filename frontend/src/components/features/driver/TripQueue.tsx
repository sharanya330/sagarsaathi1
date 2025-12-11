"use client"

import * as React from "react"
import { MapPin, Calendar, Users } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface Trip {
    _id: string
    origin: { address: string }
    stops: { address: string; order: number }[]
    startDate: string
    endDate: string
    groupSize: number
    user: { name: string; phone: string }
}

export function TripQueue() {
    const [trips, setTrips] = React.useState<Trip[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchTrips()
    }, [])

    async function fetchTrips() {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/trips', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
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
        return <div className="text-center py-8">Loading trips...</div>
    }

    if (trips.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No trips available</div>
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
                <Card key={trip._id}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                            <span>{trip.origin.address}</span>
                            <span className="text-muted-foreground">to</span>
                            <span>{trip.stops[trip.stops.length - 1]?.address || 'Destination'}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{trip.stops.map(s => s.address).join(" → ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{format(new Date(trip.startDate), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{trip.groupSize} Passengers</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                            Requested by: {trip.user?.name || trip.user?.phone || 'User'}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => handleAcceptTrip(trip._id)}
                        >
                            Accept Trip
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )

    async function handleAcceptTrip(tripId: string) {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}')
            const token = localStorage.getItem('token')
            const response = await fetch(`/api/trips/${tripId}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ driverId: user._id })
            })

            if (response.ok) {
                // Set as active trip for tracking
                localStorage.setItem('activeTrip', tripId)
                toast.success("Trip accepted successfully!", {
                    description: "Go to 'Active Trip' tab to start tracking"
                })
                fetchTrips() // Refresh the list
            } else {
                const error = await response.json()
                toast.error(error.message || "Failed to accept trip")
            }
        } catch (error) {
            toast.error("Network error")
        }
    }
}
