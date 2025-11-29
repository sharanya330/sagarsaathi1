import { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { UserRegisterForm } from "@/components/features/auth/UserRegisterForm"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
    title: "User Registration - SagarSaathi",
    description: "Create a user account",
}

export default function UserRegisterPage() {
    return (
        <div className="container relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[120px] animate-pulse-glow delay-1000" />

            <Link
                href="/register"
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
                    <div className="flex flex-col space-y-2 text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            User Registration
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details to create a user account
                        </p>
                    </div>
                    <UserRegisterForm />
                    <p className="px-8 text-center text-sm text-muted-foreground mt-6">
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
