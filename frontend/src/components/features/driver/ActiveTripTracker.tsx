"use client"

import * as React from "react"
import { toast } from "sonner"
import { MapPin, AlertTriangle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { io, Socket } from "socket.io-client"

interface Location {
    lat: number
    lng: number
}

export function ActiveTripTracker() {
    const [socket, setSocket] = React.useState<Socket | null>(null)
    const [location, setLocation] = React.useState<Location | null>(null)
    const [tracking, setTracking] = React.useState(false)
    const [tripId, setTripId] = React.useState<string | null>(null)
    const watchIdRef = React.useRef<number | null>(null)

    React.useEffect(() => {
        // Get active trip from localStorage (in real app, fetch from API)
        const activeTrip = localStorage.getItem('activeTrip')
        if (activeTrip) {
            setTripId(activeTrip)
        }

        // Connect to Socket.io
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin)
        setSocket(newSocket)

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current)
            }
            newSocket.disconnect()
        }
    }, [])

    function startTracking() {
        if (!tripId) {
            toast.error("No active trip found")
            return
        }

        if (!navigator.geolocation) {
            toast.error("Geolocation not supported")
            return
        }

        // Join trip room
        socket?.emit('join-trip', tripId)

        // Start watching position
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const newLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                setLocation(newLocation)

                // Send location update via Socket.io
                socket?.emit('location-update', {
                    tripId,
                    location: newLocation
                })
            },
            (error) => {
                console.error("Geolocation error:", error)
                toast.error("Failed to get location")
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )

        setTracking(true)
        toast.success("GPS tracking started")
    }

    function stopTracking() {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current)
            watchIdRef.current = null
        }
        setTracking(false)
        toast.info("GPS tracking stopped")
    }

    function triggerSOS() {
        if (!tripId || !location) {
            toast.error("Cannot trigger SOS: No location available")
            return
        }

        socket?.emit('trigger-sos', {
            tripId,
            location
        })

        toast.error("SOS ALERT TRIGGERED!", {
            description: "Emergency services have been notified",
            duration: 10000
        })
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Active Trip Tracking</CardTitle>
                    {tracking && (
                        <Badge variant="default" className="animate-pulse">
                            <Navigation className="h-3 w-3 mr-1" />
                            Live
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {location && (
                    <div className="space-y-2 p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span className="font-mono">
                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Location updates every few seconds
                        </p>
                    </div>
                )}

                <div className="flex gap-2">
                    {!tracking ? (
                        <Button onClick={startTracking} className="flex-1">
                            <Navigation className="mr-2 h-4 w-4" />
                            Start Tracking
                        </Button>
                    ) : (
                        <Button onClick={stopTracking} variant="outline" className="flex-1">
                            Stop Tracking
                        </Button>
                    )}

                    <Button
                        onClick={triggerSOS}
                        variant="destructive"
                        disabled={!tracking}
                    >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        SOS
                    </Button>
                </div>

                {!tripId && (
                    <p className="text-sm text-muted-foreground text-center">
                        Accept a trip to start tracking
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
