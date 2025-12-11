import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Driver from '@/models/Driver';
import { generateToken } from '@/lib/auth';
import OTP from '@/models/OTP';
import nodemailer from 'nodemailer';

// Email configuration
let transporter: nodemailer.Transporter | null = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

// OTP Store (Database used instead of in-memory)

// Generate random 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Email or console
async function sendOTP(email: string, otp: string): Promise<boolean> {
    if (transporter) {
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'SagarSaathi Verification Code',
                text: `Your SagarSaathi verification code is: ${otp}. Valid for 5 minutes.`,
            });
            console.log(`✓ Email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Email Error:', error);
            console.log(`⚠ Fallback: OTP for ${email} is ${otp}`);
            return false;
        }
    } else {
        // Mock mode - log to console
        console.log(`📧 MOCK OTP for ${email}: ${otp}`);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, role } = body;

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP in Database
        await OTP.create({ email, otp });

        // Send OTP
        await sendOTP(email, otp);

        return NextResponse.json({
            message: 'OTP sent successfully',
            emailEnabled: !!transporter,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
