import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Driver from '@/models/Driver';
import Admin from '@/models/Admin';
import { generateToken } from '@/lib/auth';
import OTP from '@/models/OTP';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email: rawEmail, otp, role, phone, name, vehicleType, vehicleNumber, cityBase, emergencyContact } = body;

        if (!rawEmail || !otp || !phone) {
            return NextResponse.json(
                { message: 'Email, OTP, and Phone number are required' },
                { status: 400 }
            );
        }

        const email = rawEmail.toLowerCase();

        // Check if OTP exists and is valid
        const storedOTP = await OTP.findOne({ email, otp });

        if (!storedOTP) {
            return NextResponse.json(
                { message: 'Invalid OTP or expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // OTP is valid - delete it (and any older ones for this email)
        await OTP.deleteMany({ email });

        let user;
        if (role === 'driver') {
            user = await Driver.findOne({ email });
            if (!user) {
                // Check if email exists in User collection
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return NextResponse.json(
                        { message: 'Email already registered as a User. Cannot register as Driver.' },
                        { status: 400 }
                    );
                }

                // Create new driver
                user = await Driver.create({
                    email,
                    phone: phone || undefined,
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
            } else {
                // Update existing driver if phone/name provided
                if (phone || name) {
                    user.phone = phone || user.phone;
                    user.name = name || user.name;
                    await user.save();
                }
            }
        } else if (role === 'admin') {
            user = await Admin.findOne({ email });
            if (!user) {
                // Create new admin
                user = await Admin.create({
                    email,
                    name: name || 'Admin',
                });
            } else {
                if (name) {
                    user.name = name;
                    await user.save();
                }
            }
        } else {
            user = await User.findOne({ email });
            if (!user) {
                // Check if email exists in Driver collection
                const existingDriver = await Driver.findOne({ email });
                if (existingDriver) {
                    return NextResponse.json(
                        { message: 'Email already registered as a Driver. Cannot register as User.' },
                        { status: 400 }
                    );
                }

                // Create new user
                user = await User.create({
                    email,
                    phone: phone || undefined,
                    name: name || 'New User',
                    emergencyContact: emergencyContact || {},
                });
            } else {
                // Update existing user if phone/name provided
                if (phone || name) {
                    user.phone = phone || user.phone;
                    user.name = name || user.name;
                    await user.save();
                }
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


