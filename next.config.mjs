/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    images: {
        domains: ['via.placeholder.com',
            'res.cloudinary.com',
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'png.pngtree.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
