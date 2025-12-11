import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Driver from '@/models/Driver';
import { generateToken } from '@/lib/auth';
import OTP from '@/models/OTP';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email: rawEmail, otp, role, phone, name, vehicleType, vehicleNumber, cityBase, emergencyContact } = body;

        if (!rawEmail || !otp) {
            return NextResponse.json(
                { message: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        const email = rawEmail.toLowerCase();

        // Check if OTP exists and is valid
        const storedOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        console.log(`[Verify Debug] Email: ${email}, Received OTP: ${otp}`);
        console.log(`[Verify Debug] Stored OTP Record:`, storedOTP);

        if (!storedOTP) {
            console.log('[Verify Debug] No OTP found in DB');
            return NextResponse.json(
                { message: 'OTP not found or expired. Please request a new one.' },
                { status: 400 }
            );
        }

        const isMatch = String(storedOTP.otp).trim() === String(otp).trim();
        console.log(`[Verify Debug] Match Result: ${isMatch} (Stored: '${storedOTP.otp}', Received: '${otp}')`);

        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid OTP' },
                { status: 400 }
            );
        }

        // OTP is valid - delete it (and any older ones for this email)
        await OTP.deleteMany({ email });

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
            { message: error instanceof Error ? error.message : 'Server error during verification' },
            { status: 500 }
        );
    }
}


