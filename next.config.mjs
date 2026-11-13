
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.29.239", "192.168.1.17"],

  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/cookie-policy",
        destination: "/cookies",
        permanent: true,
      },
      {
        source: "/dmca",
        destination: "/copyright",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
