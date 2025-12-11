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

const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
})

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    type: "login" | "register"
    userType: "user" | "driver"
}

export function AuthForm({ className, userType, ...props }: AuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [step, setStep] = React.useState<"email" | "otp">("email")

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
    })

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
    })

    const router = useRouter()

    async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, role: userType })
            })

            if (response.ok) {
                const data = await response.json()
                setStep("otp")

                // Show OTP in toast (development mode)
                if (data.devOTP) {
                    toast.success("OTP sent successfully", {
                        description: `Your OTP is ${data.devOTP} ${data.emailEnabled ? '(also sent via Email)' : '(Email not configured)'}`,
                        duration: 10000,
                    })
                } else {
                    toast.success("OTP sent via Email", {
                        description: "Check your email for the OTP",
                        duration: 5000,
                    })
                }
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to send OTP" }))
                toast.error(errorData.message || "Failed to send OTP")
            }
        } catch {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    async function onOtpSubmit(data: z.infer<typeof otpSchema>) {
        setIsLoading(true)
        try {
            const email = emailForm.getValues("email")
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: data.otp, role: userType })
            })

            if (response.ok) {
                const result = await response.json()
                localStorage.setItem('token', result.token)
                localStorage.setItem('user', JSON.stringify(result.user))
                toast.success("Login successful")
                if (userType === "driver") {
                    router.push("/driver/dashboard")
                } else {
                    router.push("/dashboard")
                }
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
            {step === "email" ? (
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                {...emailForm.register("email")}
                            />
                            {emailForm.formState.errors.email && (
                                <p className="text-sm text-red-400">
                                    {emailForm.formState.errors.email.message}
                                </p>
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
                                autoCapitalize="none"
                                autoComplete="one-time-code"
                                autoCorrect="off"
                                disabled={isLoading}
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 tracking-widest text-center text-lg"
                                {...otpForm.register("otp")}
                            />
                            {otpForm.formState.errors.otp && (
                                <p className="text-sm text-red-400">
                                    {otpForm.formState.errors.otp.message}
                                </p>
                            )}
                        </div>
                        <Button disabled={isLoading} className="bg-primary hover:bg-primary/90 text-black font-semibold transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify & Login
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setStep("email")}
                            disabled={isLoading}
                            type="button"
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                            Back to Email
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
