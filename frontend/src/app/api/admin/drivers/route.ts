import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Driver from '@/models/Driver';
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

        const drivers = await Driver.find().select('-__v').sort({ createdAt: -1 });

        return NextResponse.json({ drivers });
    } catch (error) {
        console.error('Get drivers error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
