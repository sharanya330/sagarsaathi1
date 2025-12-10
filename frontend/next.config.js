/** @type {import('next').NextConfig} */
const nextConfig = {
    // Optimized for Vercel deployment
    reactStrictMode: true,
    swcMinify: true,

    // Environment variables validation
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    },

    // Image optimization
    images: {
        domains: ['res.cloudinary.com'], // Add your image domains
        formats: ['image/avif', 'image/webp'],
    },

    // Performance optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
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
        ];
    },
};

module.exports = nextConfig;
