"use client";

import dynamic from "next/dynamic";

// 진도가 localStorage에만 있으므로 서버에서 그릴 수 있는 게 없다.
// 클라이언트 전용으로 렌더해 hydration 불일치와 effect 초기화를 함께 없앤다.
const SessionScreen = dynamic(
  () => import("./SessionScreen").then((module) => module.SessionScreen),
  { ssr: false },
);

export function SessionPage() {
  return <SessionScreen />;
}
