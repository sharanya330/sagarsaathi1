"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { signIn, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const emailSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
})

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
})

type EmailFormData = z.infer<typeof emailSchema>
type OtpFormData = z.infer<typeof otpSchema>

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    type: "login" | "register"
    userType: "user" | "driver" | "admin"
}

export function AuthForm({ className, userType, ...props }: AuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [step, setStep] = React.useState<"email" | "otp">("email")
    const router = useRouter()
    const { data: session } = useSession()

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    })

    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    })

    useEffect(() => {
        const handleSSO = async () => {
            if (session?.user?.email) {
                try {
                    const res = await fetch('/api/auth/exchange-token', {
                        method: 'POST',
                    })
                    if (res.ok) {
                        const data = await res.json()
                        localStorage.setItem('token', data.token)
                        localStorage.setItem('user', JSON.stringify(data.user))
                        toast.success("Logged in successfully")
                        router.push('/dashboard')
                    } else {
                        toast.error("Failed to login with Google")
                    }
                } catch (error) {
                    console.error("SSO Error:", error)
                    toast.error("Error logging in with Google")
                }
            }
        }
        handleSSO()
    }, [session, router])

    async function onEmailSubmit(data: EmailFormData) {
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, role: userType })
            })

            const result = await response.json()

            if (response.ok) {
                setStep("otp")
                if (result.devOTP) {
                    toast.success("OTP sent successfully", {
                        description: `Your OTP is ${result.devOTP} ${result.emailEnabled ? '(also sent via Email)' : '(Email not configured)'}`,
                        duration: 10000,
                    })
                } else {
                    toast.success("OTP sent via Email", {
                        description: "Check your email for the OTP",
                        duration: 5000,
                    })
                }
            } else {
                toast.error(result.message || "Failed to send OTP")
            }
        } catch {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    async function onOtpSubmit(data: OtpFormData) {
        setIsLoading(true)
        try {
            const email = emailForm.getValues("email")
            const response = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp: data.otp,
                    phone: data.phone,
                    role: userType
                })
            })

            const result = await response.json()

            if (response.ok) {
                localStorage.setItem('token', result.token)
                localStorage.setItem('user', JSON.stringify(result.user))
                if (userType === "driver") {
                    router.push("/driver/dashboard")
                } else {
                    router.push("/dashboard")
                }
                toast.success("Logged in successfully")
            } else {
                toast.error(result.message || "Invalid OTP")
                otpForm.setError("otp", { message: result.message || "Invalid OTP" })
            }
        } catch {
            toast.error("Network error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                    {step === 'email' ? 'Welcome back' : 'Verify OTP'}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                    {step === 'email'
                        ? 'Enter your email to sign in to your account'
                        : 'Enter the verification code sent to your email'}
                </p>
            </div>

            {step === 'email' && userType !== 'admin' && (
                <div className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => signIn('google')}
                        disabled={isLoading}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>
                </div>
            )}

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
                        <div className="text-center text-sm">
                            <p className="text-muted-foreground">
                                Enter the code sent to
                            </p>
                            <p className="font-medium text-white">
                                {emailForm.getValues("email")}
                            </p>
                        </div>
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
                        {userType !== 'admin' && (
                            <div className="grid gap-2">
                                <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="9876543210"
                                    type="tel"
                                    autoCapitalize="none"
                                    autoComplete="tel"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20"
                                    {...otpForm.register("phone")}
                                />
                                {otpForm.formState.errors.phone && (
                                    <p className="text-sm text-red-400">
                                        {otpForm.formState.errors.phone.message}
                                    </p>
                                )}
                            </div>
                        )}
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
            )
            }
        </div >
    )
}
