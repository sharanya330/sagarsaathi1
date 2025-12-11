"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Driver {
    _id: string
    name: string
    phone: string
    vehicleType: string
    vehicleNumber: string
    cityBase: string
    isVerified: boolean
    isSuspended: boolean
}

export function DriverList() {
    const [drivers, setDrivers] = React.useState<Driver[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetchDrivers()
    }, [])

    async function fetchDrivers() {
        try {
            const response = await fetch('/api/admin/drivers')
            if (response.ok) {
                const data = await response.json()
                setDrivers(data)
            } else {
                toast.error("Failed to load drivers")
            }
        } catch (error) {
            toast.error("Network error")
        } finally {
            setLoading(false)
        }
    }

    async function handleVerify(driverId: string) {
        try {
            const response = await fetch(`/api/admin/drivers/${driverId}/verify`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                toast.success("Driver verified successfully")
                fetchDrivers()
            } else {
                toast.error("Failed to verify driver")
            }
        } catch (error) {
            toast.error("Network error")
        }
    }

    async function handleReject(driverId: string) {
        try {
            const response = await fetch(`/api/admin/drivers/${driverId}/reject`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: "Documents not valid" })
            })

            if (response.ok) {
                toast.success("Driver rejected")
                fetchDrivers()
            } else {
                toast.error("Failed to reject driver")
            }
        } catch (error) {
            toast.error("Network error")
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading drivers...</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {drivers.map((driver) => (
                    <TableRow key={driver._id}>
                        <TableCell>{driver.name || 'N/A'}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.vehicleType} - {driver.vehicleNumber || 'N/A'}</TableCell>
                        <TableCell>{driver.cityBase || 'N/A'}</TableCell>
                        <TableCell>
                            {driver.isSuspended ? (
                                <Badge variant="destructive">Rejected</Badge>
                            ) : driver.isVerified ? (
                                <Badge>Verified</Badge>
                            ) : (
                                <Badge variant="secondary">Pending</Badge>
                            )}
                        </TableCell>
                        <TableCell>
                            {!driver.isVerified && !driver.isSuspended && (
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleVerify(driver._id)}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleReject(driver._id)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
