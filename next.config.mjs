/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      basePath: '/app/stock',
    instrumentationHook: true,
  },
};

export default nextConfig;
