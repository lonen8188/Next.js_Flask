import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // 🚨 experimental 내부가 아니라 바깥에 바로 선언해 보세요
  // @ts-ignore (타입 에러가 계속 나면 무시하고 실행해도 됩니다. 런타임에는 작동함)
  allowedDevOrigins: ['192.168.0.12', 'localhost:3000'],
};

export default nextConfig;