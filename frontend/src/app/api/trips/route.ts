import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

// GET /api/trips - Get all trips for authenticated user
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

        const trips = await Trip.find({ user: authUser.userId })
            .populate('driver', 'name phone vehicleType vehicleNumber')
            .sort({ createdAt: -1 });

        return NextResponse.json({ trips });
    } catch (error) {
        console.error('Get trips error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}

// POST /api/trips - Create new trip
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { origin, stops, groupSize, startDate, endDate } = body;

        if (!groupSize || !startDate || !endDate) {
            return NextResponse.json(
                { message: 'Group size, start date, and end date are required' },
                { status: 400 }
            );
        }

        const trip = await Trip.create({
            user: authUser.userId,
            origin,
            stops: stops || [],
            groupSize,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'PENDING',
        });

        // Update user's active trip
        await User.findByIdAndUpdate(authUser.userId, {
            activeTrip: trip._id,
        });

        return NextResponse.json({ trip }, { status: 201 });
    } catch (error) {
        console.error('Create trip error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
