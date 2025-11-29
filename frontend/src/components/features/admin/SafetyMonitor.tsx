"use client"

import * as React from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Trip {
    _id: string
    user: { name: string; phone: string }
    driver: { name: string; phone: string; vehicleNumber: string }
    origin: { address: string }
    status: string
    sosTriggered: boolean
}

export function SafetyMonitor() {
    const [trips, setTrips] = React.useState<Trip[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchActiveTrips()
        // Refresh every 30 seconds
        const interval = setInterval(fetchActiveTrips, 30000)
        return () => clearInterval(interval)
    }, [])

    async function fetchActiveTrips() {
        try {
            const response = await fetch('http://localhost:5001/api/admin/trips/active')
            if (response.ok) {
                const data = await response.json()
                setTrips(data)
            } else {
                toast.error("Failed to load active trips")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading active trips...</div>
    }

    if (trips.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">No active trips</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>SOS</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trips.map((trip) => (
                    <TableRow key={trip._id}>
                        <TableCell className="font-mono text-xs">{trip._id.slice(-6)}</TableCell>
                        <TableCell>
                            {trip.user?.name || trip.user?.phone || 'N/A'}
                        </TableCell>
                        <TableCell>
                            {trip.driver?.name || trip.driver?.phone || 'N/A'}
                        </TableCell>
                        <TableCell>{trip.driver?.vehicleNumber || 'N/A'}</TableCell>
                        <TableCell>
                            <Badge variant={trip.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                                {trip.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {trip.sosTriggered ? (
                                <Badge variant="destructive">SOS ACTIVE</Badge>
                            ) : (
                                <span className="text-muted-foreground">Normal</span>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
