"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const driverSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    vehicleType: z.enum(["SUPRO", "INNOVA", "SUV", "TEMPO_TRAVELLER", "OTHER"]),
    vehicleNumber: z.string().min(4, "Vehicle number required"),
    cityBase: z.string().min(2, "City is required"),
})

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
})

export function DriverRegisterForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [step, setStep] = React.useState<"details" | "otp">("details")
    const [formData, setFormData] = React.useState<z.infer<typeof driverSchema> | null>(null)

    const detailsForm = useForm<z.infer<typeof driverSchema>>({
        resolver: zodResolver(driverSchema),
    })

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
    })

    const router = useRouter()

    async function onDetailsSubmit(data: z.infer<typeof driverSchema>) {
        setIsLoading(true)
        try {
            // First send OTP to email
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, role: 'driver' })
            })

            if (response.ok) {
                const resData = await response.json()
                setFormData(data)
                setStep("otp")

                if (resData.devOTP) {
                    toast.success("OTP sent successfully", {
                        description: `Your OTP is ${resData.devOTP}`,
                        duration: 10000,
                    })
                } else {
                    toast.success("OTP sent via Email")
                }
            } else {
                toast.error("Failed to send OTP")
            }
        } catch {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    async function onOtpSubmit(data: z.infer<typeof otpSchema>) {
        if (!formData) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    otp: data.otp,
                    role: 'driver',
                    ...formData
                })
            })

            if (response.ok) {
                const result = await response.json()
                localStorage.setItem('token', result.token)
                localStorage.setItem('user', JSON.stringify(result.user))
                toast.success("Registration successful")
                router.push("/driver/dashboard")
            } else {
                toast.error("Invalid OTP")
                otpForm.setError("otp", { message: "Invalid OTP" })
            }
        } catch {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            {step === "details" ? (
                <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="Driver Name"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                {...detailsForm.register("name")}
                            />
                            {detailsForm.formState.errors.name && (
                                <p className="text-sm text-red-400">{detailsForm.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                {...detailsForm.register("email")}
                            />
                            {detailsForm.formState.errors.email && (
                                <p className="text-sm text-red-400">{detailsForm.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="+91 98765 43210"
                                type="tel"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                {...detailsForm.register("phone")}
                            />
                            {detailsForm.formState.errors.phone && (
                                <p className="text-sm text-red-400">{detailsForm.formState.errors.phone.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="vehicleType" className="text-gray-300">Vehicle Type</Label>
                            <select
                                id="vehicleType"
                                className={cn(
                                    "flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-slate-900/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                                )}
                                {...detailsForm.register("vehicleType")}
                            >
                                <option value="" disabled className="bg-slate-900 text-gray-400">Select vehicle type</option>
                                <option value="SUPRO" className="bg-slate-900">Mahindra Supro</option>
                                <option value="INNOVA" className="bg-slate-900">Toyota Innova</option>
                                <option value="SUV" className="bg-slate-900">SUV</option>
                                <option value="TEMPO_TRAVELLER" className="bg-slate-900">Tempo Traveller</option>
                                <option value="OTHER" className="bg-slate-900">Other</option>
                            </select>
                            {detailsForm.formState.errors.vehicleType && (
                                <p className="text-sm text-red-400">{detailsForm.formState.errors.vehicleType.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="vehicleNumber" className="text-gray-300">Vehicle Number</Label>
                            <Input
                                id="vehicleNumber"
                                placeholder="TS09AB1234"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                {...detailsForm.register("vehicleNumber")}
                            />
                            {detailsForm.formState.errors.vehicleNumber && (
                                <p className="text-sm text-red-400">{detailsForm.formState.errors.vehicleNumber.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cityBase" className="text-gray-300">City Base</Label>
                            <Input
                                id="cityBase"
                                placeholder="Hyderabad"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                {...detailsForm.register("cityBase")}
                            />
                            {detailsForm.formState.errors.cityBase && (
                                <p className="text-sm text-red-400">{detailsForm.formState.errors.cityBase.message}</p>
                            )}
                        </div>
                        <Button disabled={isLoading} className="bg-primary hover:bg-primary/90 text-black font-semibold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send OTP
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="otp" className="text-gray-300">Enter OTP</Label>
                            <Input
                                id="otp"
                                placeholder="123456"
                                type="text"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 tracking-widest text-center text-lg"
                                {...otpForm.register("otp")}
                            />
                            {otpForm.formState.errors.otp && (
                                <p className="text-sm text-red-400">{otpForm.formState.errors.otp.message}</p>
                            )}
                        </div>
                        <Button disabled={isLoading} className="bg-primary hover:bg-primary/90 text-black font-semibold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify & Register
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setStep("details")}
                            disabled={isLoading}
                            type="button"
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                            Back to Details
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
