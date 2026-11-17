import type { NextConfig } from 'next';
const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    cacheOnFrontendNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnline: true,
    swcMinify: true,
    disable: false,
    workboxOptions: {
        disableDevLogs: true
    }
});

const nextConfig: NextConfig = {
    reactStrictMode: false,
    //Added below line productionBrowserSourceMaps do reduce build space
    productionBrowserSourceMaps: false,
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb'
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.blob.core.windows.net', // ✅ wildcard must include subdomains correctly
                pathname: '**' // ✅ allow all paths
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/api/admission/:path*',
                destination: 'https://ivrm-dev-admission-api.azurewebsites.net/api/:path*'
            }
            // Add other services if needed
        ];
    }
};

export default withPWA(nextConfig);
