/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Three.js SSR compatibility — three needs `window`; we import 3D via dynamic({ ssr: false })
  transpilePackages: ['three'],
};

module.exports = nextConfig;
