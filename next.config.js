// /** @type {import('next').NextConfig} */
// const path = require("path"); // 1. path 선언

// const nextConfig = {};

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path"); // 1. path 선언

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const withNextIntl = require("next-intl/plugin")(
//   // This is the default (also the `src` folder is supported out of the box)
//   "./i18n.ts",
// );
const isProd = process.env.NODE_ENV === "production";

// const withPWA = require("next-pwa")({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
// });

/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")], // 2. sassOptions 옵션 추가
  },
  experimental: {
    serverActions: true,
  },
  // assetPrefix: isProd ? "https://www.yummygame.io" : undefined,
  // distDir: "dist",
};

// module.exports = withNextIntl(nextConfig);
module.exports = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
