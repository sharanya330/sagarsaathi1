import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Driver from '@/models/Driver';
import { generateToken } from '@/lib/auth';

// Import OTP store from login route
// In production, use Redis or similar
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, otp, role, phone, name, vehicleType, vehicleNumber, cityBase, emergencyContact } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Check if OTP exists and is valid
        const storedOTP = otpStore[email];

        if (!storedOTP) {
            return NextResponse.json(
                { message: 'OTP not found. Please request a new one.' },
                { status: 400 }
            );
        }

        if (Date.now() > storedOTP.expiresAt) {
            delete otpStore[email];
            return NextResponse.json(
                { message: 'OTP expired. Please request a new one.' },
                { status: 400 }
            );
        }

        if (String(storedOTP.otp).trim() !== String(otp).trim()) {
            return NextResponse.json(
                { message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // OTP is valid - delete it
        delete otpStore[email];

        let user;
        if (role === 'driver') {
            user = await Driver.findOne({ email });
            if (!user) {
                // Create new driver
                user = await Driver.create({
                    email,
                    phone: phone || '',
                    name: name || 'New Driver',
                    vehicleType: vehicleType || 'OTHER',
                    vehicleNumber,
                    cityBase,
                    docs: {
                        licenseUrl: '',
                        rcUrl: '',
                        insuranceUrl: '',
                        permitUrl: '',
                        selfieUrl: '',
                    },
                });
            }
        } else {
            user = await User.findOne({ email });
            if (!user) {
                // Create new user
                user = await User.create({
                    email,
                    phone: phone || '',
                    name: name || 'New User',
                    emergencyContact: emergencyContact || {},
                });
            }
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
            role: role || 'user',
        });

        return NextResponse.json({ token, user });
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json(
            { message: 'Server error during verification' },
            { status: 500 }
        );
    }
}

// Export OTP store to share with login route
export { otpStore };
