import Link from "next/link"
import { ArrowRight, Shield, Clock, MapPin, ChevronRight, Star, Users, Car } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function IndexPage() {
    return (
        <div className="flex min-h-screen flex-col overflow-hidden">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-16 text-center md:pt-20 wave-bg">
                {/* Floating Elements (Buoys) */}
                <div className="absolute top-1/4 left-10 animate-float-slow opacity-60 hidden md:block">
                    <div className="glass-card p-4 rounded-full">
                        <Shield className="h-8 w-8 text-cyan-400" />
                    </div>
                </div>
                <div className="absolute bottom-1/3 right-10 animate-float-fast opacity-60 hidden md:block">
                    <div className="glass-card p-4 rounded-full">
                        <MapPin className="h-8 w-8 text-purple-400" />
                    </div>
                </div>

                <div className="container relative z-10 flex flex-col items-center gap-8">


                    <h1 className="max-w-5xl text-6xl font-extrabold tracking-tight md:text-8xl lg:text-9xl leading-tight">
                        SagarSaathi <br />
                        <span className="text-fluid">Where every journey feels like home</span>
                    </h1>

                    <p className="max-w-2xl text-lg text-blue-100/80 md:text-xl leading-relaxed">
                        Your trusted companion for safe intercity car travel.
                        Connect with verified drivers for secure, comfortable family trips.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-8">
                        <Link href="/login">
                            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]">
                                Book Your Trip <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/register/driver">
                            <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:scale-105">
                                Join as Driver
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-16 border-t border-white/10 pt-10 w-full max-w-4xl">
                        {[
                            { label: "Verified Drivers", value: "500+" },
                            { label: "Happy Families", value: "10k+" },
                            { label: "Cities Connected", value: "12" },
                            { label: "Safety Rating", value: "4.9/5" },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                                <span className="text-4xl font-bold text-white mb-1">{stat.value}</span>
                                <span className="text-sm text-cyan-200/70 uppercase tracking-wider">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-24 md:py-32">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4 text-white">Why Choose SagarSaathi?</h2>
                    <p className="text-blue-200/60 text-lg">Reliable 4-wheel travel for you and your loved ones.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {[
                        {
                            icon: Shield,
                            title: "Verified Drivers",
                            desc: "Every driver undergoes rigorous background checks, driving skill assessments, and police verification.",
                            color: "text-cyan-400"
                        },
                        {
                            icon: Car,
                            title: "Comfortable Cars",
                            desc: "Choose from a fleet of well-maintained sedans, SUVs, and luxury vehicles for your family trips.",
                            color: "text-blue-400"
                        },
                        {
                            icon: MapPin,
                            title: "Real-time Tracking",
                            desc: "Share your live trip status with family members for complete peace of mind during your journey.",
                            color: "text-purple-400"
                        }
                    ].map((feature, i) => (
                        <div key={i} className="glass-card p-8 transition-all hover:-translate-y-2 hover:bg-white/10 group">
                            <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ${feature.color} group-hover:scale-110 transition-transform`}>
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-white">{feature.title}</h3>
                            <p className="text-blue-100/70 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container pb-24">
                <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-24 text-center md:px-12 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 animate-pulse-glow" />
                    <div className="relative z-10">
                        <h2 className="mb-6 text-3xl font-bold md:text-5xl text-white">Ready for your next trip?</h2>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100/80">
                            Join thousands of families who trust SagarSaathi for their intercity travel needs.
                        </p>
                        <Link href="/register/user">
                            <Button size="lg" className="h-14 rounded-full px-10 text-lg bg-white text-black hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all">
                                Create Free Account
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="container py-12 md:py-16">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div className="col-span-2">
                            <h3 className="text-2xl font-bold text-fluid mb-4">SagarSaathi</h3>
                            <p className="max-w-xs text-blue-200/60">
                                Redefining intercity road travel with safety, comfort, and reliability at its core.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-white">Platform</h4>
                            <ul className="space-y-2 text-sm text-blue-200/60">
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Find a Ride</Link></li>
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Become a Driver</Link></li>
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Safety Standards</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-4 font-semibold text-white">Company</h4>
                            <ul className="space-y-2 text-sm text-blue-200/60">
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
                        © 2024 SagarSaathi. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}
