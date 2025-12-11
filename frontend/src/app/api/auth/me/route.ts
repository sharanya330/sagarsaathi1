import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Driver from '@/models/Driver';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        let user;
        if (authUser.role === 'driver') {
            user = await Driver.findById(authUser.userId).select('-__v');
        } else {
            user = await User.findById(authUser.userId).select('-__v');
        }

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user, role: authUser.role });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
