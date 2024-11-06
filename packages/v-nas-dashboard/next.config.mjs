const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  transpilePackages: ['dashboard-core'],
  /* config options here */
  typescript: {
    // WARNING: This allows production builds to successfully complete even if
    // your project has type errors. Use this option with caution.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
