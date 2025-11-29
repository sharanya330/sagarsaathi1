import { Metadata } from "next"
import Link from "next/link"
import { User, Car, ChevronLeft } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "Register - SagarSaathi",
    description: "Create an account",
}

export default function RegisterPage() {
    return (
        <div className="container relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[120px] animate-pulse-glow delay-1000" />

            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8 text-white hover:text-primary hover:bg-white/10"
                )}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Link>

            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
                <div className="glass-card p-8 animate-float">
                    <div className="flex flex-col space-y-2 text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Choose your account type to get started
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <Link
                            href="/register/user"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "h-28 flex flex-col items-center justify-center gap-3 border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all hover:-translate-y-1"
                            )}
                        >
                            <User className="h-8 w-8 text-primary" />
                            <span className="font-semibold text-lg">Register as User</span>
                        </Link>

                        <Link
                            href="/register/driver"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "h-28 flex flex-col items-center justify-center gap-3 border-white/10 bg-white/5 hover:bg-white/10 hover:border-secondary/50 transition-all hover:-translate-y-1"
                            )}
                        >
                            <Car className="h-8 w-8 text-secondary" />
                            <span className="font-semibold text-lg">Register as Driver</span>
                        </Link>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground mt-8">
                        <Link
                            href="/login"
                            className="hover:text-primary underline underline-offset-4 transition-colors"
                        >
                            Already have an account? Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
