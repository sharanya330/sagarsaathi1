/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimized for Vercel deployment
    reactStrictMode: true,

    // Serverless function configuration
    serverExternalPackages: ['mongoose', 'nodemailer'],

    // Ignore TypeScript and ESLint errors during build
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Environment variables validation
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    },

    // Image optimization
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
    },

    // Performance optimizations
    compiler: {
        // removeConsole: process.env.NODE_ENV === 'production',
    },

    // Dev indicators
    devIndicators: {
        buildActivity: false,
        appIsrStatus: false,
    },

    // Headers for security and performance
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                ],
            },
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: process.env.FRONTEND_URL || '*'
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS'
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization'
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
