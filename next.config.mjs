/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
    ],
  },
  // Los errores de TypeScript ahora SÍ bloquean el build (antes se ignoraban y
  // dejaban pasar bugs de tipos). ESLint sigue sin bloquear por ahora para no
  // frenar el build con reglas de estilo; se puede endurecer más adelante.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
