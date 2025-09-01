/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: "standalone",
  experimental: {
    optimizePackageImports: ["@heroui/react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
  transpilePackages: ["@heroui/react", "@heroui/theme"],
  webpack: (webpackConfig: {
    resolve: {
      extensionAlias: { ".cjs": string[]; ".js": string[]; ".mjs": string[] };
    };
  }) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },
};

export default nextConfig;
