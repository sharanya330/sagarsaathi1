import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json(
                { message: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        const users = await User.find().select('-__v').sort({ createdAt: -1 });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
