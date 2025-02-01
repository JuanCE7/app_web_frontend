/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/tcc",
  trailingSlash: false, // Esto evita redirecciones problemáticas
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/tcc/api/:path*", // Redirige las solicitudes a /api al backend
        destination: "http://backend:4000/api/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
