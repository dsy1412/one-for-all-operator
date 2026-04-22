/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === "1";

const nextConfig = {
  basePath: isVercel ? "/eml" : "",
  assetPrefix: isVercel ? "/eml" : "",
};

export default nextConfig;
