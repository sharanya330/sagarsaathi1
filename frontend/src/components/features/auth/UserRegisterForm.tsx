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

const userSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    emergencyName: z.string().optional(),
    emergencyPhone: z.string().optional(),
})

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
})

export function UserRegisterForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [step, setStep] = React.useState<"details" | "otp">("details")
    const [formData, setFormData] = React.useState<z.infer<typeof userSchema> | null>(null)

    const detailsForm = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
    })

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
    })

    const router = useRouter()

    async function onDetailsSubmit(data: z.infer<typeof userSchema>) {
        setIsLoading(true)
        try {
            // First send OTP to email
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, role: 'user' })
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
            const response = await fetch('http://localhost:5001/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone,
                    otp: data.otp,
                    role: 'user',
                    name: formData.name,
                    emergencyContact: {
                        name: formData.emergencyName,
                        phone: formData.emergencyPhone
                    }
                })
            })

            if (response.ok) {
                const result = await response.json()
                localStorage.setItem('token', result.token)
                localStorage.setItem('user', JSON.stringify(result.user))
                toast.success("Registration successful")
                router.push("/dashboard")
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
                                placeholder="John Doe"
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
                            <Label className="text-gray-300">Emergency Contact (Optional)</Label>
                            <Input
                                placeholder="Contact Name"
                                className="mb-2 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                disabled={isLoading}
                                {...detailsForm.register("emergencyName")}
                            />
                            <Input
                                placeholder="Contact Phone"
                                type="tel"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                {...detailsForm.register("emergencyPhone")}
                            />
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
