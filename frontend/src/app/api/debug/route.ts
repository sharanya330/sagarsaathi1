import { NextResponse } from 'next/server';

export async function GET() {
    const MONGODB_URI = process.env.MONGODB_URI;
    const MONGO_URI = process.env.MONGO_URI;
    const DATABASE_URL = process.env.DATABASE_URL;

    return NextResponse.json({
        status: 'Debug Info',
        checks: {
            has_MONGODB_URI: !!MONGODB_URI,
            has_MONGO_URI: !!MONGO_URI,
            has_DATABASE_URL: !!DATABASE_URL,
            has_EMAIL_USER: !!process.env.EMAIL_USER,
            has_EMAIL_PASS: !!process.env.EMAIL_PASS,
            has_JWT_SECRET: !!process.env.JWT_SECRET,
            uri_length: MONGODB_URI ? MONGODB_URI.length : 0,
            node_env: process.env.NODE_ENV,
        },
        env_keys_available: Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('KEY') && !key.includes('PASS')),
    });
}
