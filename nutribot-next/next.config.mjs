/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  /* config options here */
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://168.110.198.255:5000";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

};

export default nextConfig;
