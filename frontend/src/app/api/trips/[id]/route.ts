import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Trip from '@/models/Trip';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// GET /api/trips/[id] - Get specific trip
export async function GET(
    request: NextRequest,
    context: RouteParams
) {
    try {
        const params = await context.params;
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const trip = await Trip.findById(params.id)
            .populate('user', 'name phone email')
            .populate('driver', 'name phone vehicleType vehicleNumber');

        if (!trip) {
            return NextResponse.json(
                { message: 'Trip not found' },
                { status: 404 }
            );
        }

        // Check if user owns this trip or is the driver
        if (
            trip.user._id.toString() !== authUser.userId &&
            trip.driver?._id.toString() !== authUser.userId
        ) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            );
        }

        return NextResponse.json({ trip });
    } catch (error) {
        console.error('Get trip error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}

// PUT /api/trips/[id] - Update trip
export async function PUT(
    request: NextRequest,
    context: RouteParams
) {
    try {
        const params = await context.params;
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const trip = await Trip.findById(params.id);

        if (!trip) {
            return NextResponse.json(
                { message: 'Trip not found' },
                { status: 404 }
            );
        }

        // Check if user owns this trip
        if (trip.user.toString() !== authUser.userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            );
        }

        // Update trip
        Object.assign(trip, body);
        await trip.save();

        return NextResponse.json({ trip });
    } catch (error) {
        console.error('Update trip error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/trips/[id] - Delete trip
export async function DELETE(
    request: NextRequest,
    context: RouteParams
) {
    try {
        const params = await context.params;
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const trip = await Trip.findById(params.id);

        if (!trip) {
            return NextResponse.json(
                { message: 'Trip not found' },
                { status: 404 }
            );
        }

        // Check if user owns this trip
        if (trip.user.toString() !== authUser.userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            );
        }

        await Trip.findByIdAndDelete(params.id);

        // Clear user's active trip if this was it
        await User.findByIdAndUpdate(authUser.userId, {
            $unset: { activeTrip: 1 },
        });

        return NextResponse.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Delete trip error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
