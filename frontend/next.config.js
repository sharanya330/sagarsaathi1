/** @type {import('next').NextConfig} */
const nextConfig = {
    // Remove 'standalone' for Netlify deployment
    // output: 'standalone', // Only use for Docker
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`,
            },
        ];
    },
    devIndicators: {
        buildActivity: false,
        appIsrStatus: false,
    },
};

module.exports = nextConfig;
