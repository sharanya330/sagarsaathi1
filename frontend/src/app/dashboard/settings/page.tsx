import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <Card>
                <CardHeader>
                    <CardTitle>App Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notifications">Notifications</Label>
                        <Button variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="theme">Theme</Label>
                        <Button variant="outline">Dark</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
