/** @type {import('next/config').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.jsdelivr.net',
          pathname: '/**',
        },
      ],
    },
}

export default nextConfig;
