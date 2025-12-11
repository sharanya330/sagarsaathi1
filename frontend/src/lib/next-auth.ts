
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectDB();
                    const email = user.email;
                    if (!email) return false;

                    let existingUser = await User.findOne({ email });

                    if (!existingUser) {
                        // Create new user with Name and Email
                        await User.create({
                            email,
                            name: user.name || 'New User',
                            // phone is now optional
                        });
                    } else {
                        // Update name if missing or if it's the default 'New User'
                        if ((!existingUser.name || existingUser.name === 'New User') && user.name) {
                            existingUser.name = user.name;
                            await existingUser.save();
                        }
                    }
                    return true;
                } catch (error) {
                    console.error("Error in signIn callback:", error);
                    return false;
                }
            }
            return true;
        },
    },
    pages: {
        signIn: '/login',
    }
};
