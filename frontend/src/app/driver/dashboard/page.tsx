import { Metadata } from "next"
import { DriverDashboardContent } from "@/components/features/driver/DriverDashboardContent"

export const metadata: Metadata = {
    title: "Driver Dashboard - SagarSaathi",
    description: "Manage your trips and profile",
}

export default function DriverDashboardPage() {
    return <DriverDashboardContent />
}
