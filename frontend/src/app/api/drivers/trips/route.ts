import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser || authUser.role !== 'driver') {
            return NextResponse.json(
                { message: 'Forbidden - Driver access required' },
                { status: 403 }
            );
        }

        const trips = await Trip.find({ driver: authUser.userId })
            .populate('user', 'name phone email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ trips });
    } catch (error) {
        console.error('Get driver trips error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
