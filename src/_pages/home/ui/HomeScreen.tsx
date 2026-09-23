"use client";

import { useState } from "react";
import Link from "next/link";
import { concepts } from "@/shared/api";
import {
  attemptsOf,
  loadProgress,
  masteryOf,
  priorityOf,
} from "@/entities/progress";

export function HomeScreen() {
  const [progress] = useState(loadProgress);

  const ranked = [...concepts].sort(
    (a, b) => priorityOf(progress, b.id) - priorityOf(progress, a.id),
  );

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">interview-drill</h1>
          <p className="mt-2 text-neutral-500">
            하루 5분, 헷갈리는 개념만 골라서.
          </p>
        </div>
        <p className="text-lg font-semibold tabular-nums text-emerald-600">
          {progress.xp} XP
        </p>
      </div>

      <Link
        href="/session"
        className="rounded-2xl bg-emerald-500 py-5 text-center text-lg font-semibold text-white"
      >
        오늘의 세션 시작
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-neutral-500">
          개념별 숙련도 · 약한 순
        </h2>

        {ranked.map((concept) => {
          const attempts = attemptsOf(progress, concept.id);
          const percent = Math.round(masteryOf(progress, concept.id) * 100);

          return (
            <div key={concept.id} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-base">{concept.name}</span>
                <span className="text-sm tabular-nums text-neutral-500">
                  {attempts === 0 ? "아직 안 풂" : `${percent}%`}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: attempts === 0 ? "0%" : `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
