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
async function sendOTP(email: string, otp: string): Promise<{ success: boolean; devOTP?: string }> {
    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"SagarSaathi" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'SagarSaathi Verification Code',
                text: `Your SagarSaathi verification code is: ${otp}. Valid for 5 minutes.`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #06b6d4;">SagarSaathi Verification</h2>
                        <p>Your verification code is:</p>
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 0; color: #000;">${otp}</div>
                        <p style="font-size: 14px; color: #666;">This code is valid for 5 minutes.</p>
                    </div>
                `,
            });
            console.log(`✓ Email sent to ${email}`);
            return { success: true };
        } catch (error) {
            console.error('❌ Email Error:', error);
            // In development, return the OTP so the user can still progress
            if (process.env.NODE_ENV === 'development') {
                console.log(`⚠ Fallback: OTP for ${email} is ${otp}`);
                return { success: false, devOTP: otp };
            }
            return { success: false };
        }
    } else {
        // Mock mode - log to console
        console.log(`📧 MOCK OTP for ${email}: ${otp}`);
        return { success: false, devOTP: process.env.NODE_ENV === 'development' ? otp : undefined };
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email: rawEmail, role } = body;

        if (!rawEmail) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        const email = rawEmail.toLowerCase();

        // Generate OTP
        const otp = generateOTP();

        // Delete any existing OTPs for this email to prevent race conditions
        // await OTP.deleteMany({ email });

        // Store OTP in Database
        await OTP.create({ email, otp });

        // Send OTP
        const otpResult = await sendOTP(email, otp);

        return NextResponse.json({
            message: otpResult.success ? 'OTP sent successfully' : 'OTP generation fallback',
            emailEnabled: !!transporter,
            devOTP: otpResult.devOTP,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
