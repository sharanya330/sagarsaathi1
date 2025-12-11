import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Driver from '@/models/Driver';
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

        const driver = await Driver.findById(authUser.userId);

        if (!driver) {
            return NextResponse.json(
                { message: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ driver });
    } catch (error) {
        console.error('Get driver error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser || authUser.role !== 'driver') {
            return NextResponse.json(
                { message: 'Forbidden - Driver access required' },
                { status: 403 }
            );
        }

        const body = await request.json();

        const driver = await Driver.findByIdAndUpdate(
            authUser.userId,
            body,
            { new: true }
        );

        if (!driver) {
            return NextResponse.json(
                { message: 'Driver not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ driver });
    } catch (error) {
        console.error('Update driver error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
