import type { Question } from "@/shared/api";

/** 정답 1개가 주는 XP. 어려운 문항(Lv.4~5)은 더 준다. */
export function xpFor(question: Question): number {
  return question.level >= 4 ? 15 : 10;
}

/** 연속 정답 3개마다 주는 보너스 XP. */
export function streakBonus(streak: number): number {
  return streak > 0 && streak % 3 === 0 ? 5 : 0;
}
