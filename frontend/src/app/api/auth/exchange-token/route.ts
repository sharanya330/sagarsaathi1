
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth";
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: 'user', // Default to user for SSO
        });

        return NextResponse.json({ token, user });
    } catch (error) {
        console.error('Exchange token error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
