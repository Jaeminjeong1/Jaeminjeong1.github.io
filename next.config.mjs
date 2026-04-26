const isStatic = process.env.BUILD_TARGET === 'static';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStatic ? 'export' : undefined,
  images: { unoptimized: true },
  trailingSlash: isStatic,
  env: {
    BUILD_TARGET: process.env.BUILD_TARGET ?? '',
  },
};

export default nextConfig;
