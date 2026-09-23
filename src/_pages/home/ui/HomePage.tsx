"use client";

import dynamic from "next/dynamic";

// 숙련도가 localStorage에만 있으므로 클라이언트 전용으로 렌더한다.
const HomeScreen = dynamic(
  () => import("./HomeScreen").then((module) => module.HomeScreen),
  { ssr: false },
);

export function HomePage() {
  return <HomeScreen />;
}
