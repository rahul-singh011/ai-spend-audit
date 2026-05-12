import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'groq-sdk', 'resend'],
  },
};

export default nextConfig;