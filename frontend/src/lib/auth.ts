import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
    userId: string;
    email: string;
    role?: 'user' | 'driver' | 'admin';
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d',
    });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.substring(7);
}

/**
 * Get authenticated user from request
 */
export function getAuthUser(request: NextRequest): JWTPayload | null {
    const token = extractToken(request);

    if (!token) {
        return null;
    }

    return verifyToken(token);
}

/**
 * Middleware helper to require authentication
 */
export function requireAuth(handler: (request: NextRequest, user: JWTPayload) => Promise<Response>) {
    return async (request: NextRequest) => {
        const user = getAuthUser(request);

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return handler(request, user);
    };
}

/**
 * Hash password using bcrypt
 */
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
