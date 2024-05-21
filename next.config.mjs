import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  images: {
    loader: "akamai",
    path: "/public",
  },
};

export default withPWA({
  ...nextConfig,
  dest: "build",
});
