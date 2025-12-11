import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AuthForm } from "@/components/features/auth/AuthForm"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Admin Login - SagarSaathi",
    description: "Login to SagarSaathi Admin Dashboard",
}

export default function AdminLoginPage() {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-primary" />
                        </div>
                        SagarSaathi Admin
                    </Link>
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "Administrative access for managing users, drivers, and platform settings."
                        </p>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8 bg-slate-950 min-h-screen flex flex-col">
                <div className="absolute right-4 top-4 md:right-8 md:top-8">
                    <Link href="/">
                        <Button variant="ghost" className="text-white hover:text-primary">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] flex-1">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Admin Login
                        </h1>
                        <p className="text-sm text-gray-400">
                            Enter your email to access the admin dashboard
                        </p>
                    </div>
                    <AuthForm type="login" userType="admin" />
                </div>
            </div>
        </div>
    )
}
