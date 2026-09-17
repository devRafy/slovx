/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Three.js SSR compatibility — three needs `window`; we import 3D via dynamic({ ssr: false })
  transpilePackages: ['three'],
  // Static export: `next build` emits a plain HTML/CSS/JS tree in `out/`
  // that nginx can serve as static files. Requires all pages to be pre-
  // renderable — no cookies(), headers(), or dynamic server routes.
  output: 'export',
  // next/image's default loader needs a runtime. In export mode we disable
  // optimisation so <Image> falls back to plain <img>.
  images: { unoptimized: true },
  // Static hosts can't rewrite /about → /about/index.html. Emitting each
  // route as a directory (about/index.html) fixes this without nginx tricks.
  trailingSlash: true,
};

module.exports = nextConfig;
