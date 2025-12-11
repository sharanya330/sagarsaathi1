import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Driver from '@/models/Driver';
import { getAuthUser } from '@/lib/auth';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PUT(
    request: NextRequest,
    context: RouteParams
) {
    try {
        const params = await context.params;
        await connectDB();

        const authUser = getAuthUser(request);

        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json(
                { message: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }

        const driver = await Driver.findById(params.id);

        if (!driver) {
            return NextResponse.json(
                { message: 'Driver not found' },
                { status: 404 }
            );
        }

        driver.isVerified = true;
        await driver.save();

        return NextResponse.json({
            message: 'Driver verified successfully',
            driver
        });
    } catch (error) {
        console.error('Verify driver error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
