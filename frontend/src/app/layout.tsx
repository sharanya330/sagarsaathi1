import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "SagarSaathi",
    description: "Empowering fishermen with technology",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <NextAuthProvider>
                    {children}
                    <Toaster />
                </NextAuthProvider>
            </body>
        </html>
    );
}
