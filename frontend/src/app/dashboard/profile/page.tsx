"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"
import { toast } from "sonner"

interface UserProfile {
    name: string
    email: string
    phone: string
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<UserProfile>({ name: '', email: '', phone: '' })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/login')
                    return
                }

                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    cache: 'no-store'
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                    setFormData({
                        name: data.user.name || '',
                        email: data.user.email || '',
                        phone: data.user.phone || ''
                    })
                } else {
                    toast.error("Failed to load profile")
                }
            } catch (error) {
                console.error("Profile error:", error)
                toast.error("Error loading profile")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast.success("Logged out successfully")
        router.push('/login')
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone
                })
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setIsEditing(false)
                toast.success("Profile updated successfully")
            } else {
                toast.error("Failed to update profile")
            }
        } catch (error) {
            console.error("Update error:", error)
            toast.error("Error updating profile")
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline">Edit Profile</Button>
                    ) : (
                        <div className="space-x-2">
                            <Button onClick={() => setIsEditing(false)} variant="ghost">Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={isEditing ? formData.name : (user?.name || '')}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-muted" : ""}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={user?.email || ''}
                            readOnly
                            className="bg-muted opacity-70 cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={isEditing ? formData.phone : (user?.phone || 'Not provided')}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            readOnly={!isEditing}
                            className={!isEditing ? "bg-muted" : ""}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
