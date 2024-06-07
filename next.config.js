/* next.config.mjs 파일
import withPWA from "next-pwa";

const nextConfig = {
  images: {
    domains: ["localhost", "*"],
  },
  pwa: {
    dest: "public", // PWA 관련 파일의 저장 위치
    // 여기에 다른 필요한 PWA 설정을 추가할 수 있습니다.
  },
};

export default withPWA(nextConfig);
*/

const withPWA = require("next-pwa")({
  dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
