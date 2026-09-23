"use client";

import { useState } from "react";
import Link from "next/link";
import { questions, concepts } from "@/shared/api";
import { xpFor, streakBonus } from "../model/score";

const SESSION_SIZE = 5;

export function SessionPage() {
  const deck = questions.slice(0, SESSION_SIZE);

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [wrongConceptIds, setWrongConceptIds] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const question = deck[index];

  function pick(choiceId: string) {
    if (picked) return;
    setPicked(choiceId);

    if (choiceId === question.answerId) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setXp(xp + xpFor(question) + streakBonus(nextStreak));
    } else {
      setStreak(0);
      setWrongConceptIds([...wrongConceptIds, question.conceptId]);
    }
  }

  function next() {
    if (index + 1 >= deck.length) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
  }

  if (done) {
    const correctCount = deck.length - wrongConceptIds.length;
    const wrongNames = [...new Set(wrongConceptIds)].map(
      (id) => concepts.find((c) => c.id === id)?.name ?? id,
    );

    return (
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-8 px-4 py-10">
        <div className="text-center">
          <p className="text-sm text-neutral-500">세션 완료</p>
          <p className="mt-2 text-5xl font-bold tabular-nums">
            {correctCount} / {deck.length}
          </p>
          <p className="mt-3 text-lg font-medium text-emerald-600">+{xp} XP</p>
        </div>

        {wrongNames.length > 0 && (
          <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="text-sm font-medium text-neutral-500">
              다시 볼 개념
            </p>
            <ul className="mt-2 space-y-1">
              {wrongNames.map((name) => (
                <li key={name} className="text-base">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link
          href="/"
          className="rounded-xl bg-neutral-900 py-4 text-center text-base font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          홈으로
        </Link>
      </main>
    );
  }

  const isCorrect = picked === question.answerId;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-6">
      <header className="flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${(index / deck.length) * 100}%` }}
          />
        </div>
        <span className="text-sm tabular-nums text-neutral-500">
          {index + 1} / {deck.length}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-5">
        <p className="text-lg font-medium leading-relaxed">{question.prompt}</p>

        {question.code && (
          <pre className="overflow-x-auto rounded-xl bg-neutral-100 p-4 font-mono text-sm leading-relaxed dark:bg-neutral-900">
            {question.code}
          </pre>
        )}

        <div className="flex flex-col gap-3">
          {question.choices.map((choice) => {
            const selected = picked === choice.id;
            const isAnswer = choice.id === question.answerId;

            let tone = "border-neutral-300 dark:border-neutral-700";
            if (picked) {
              if (isAnswer) tone = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950";
              else if (selected) tone = "border-red-500 bg-red-50 dark:bg-red-950";
              else tone = "border-neutral-200 opacity-50 dark:border-neutral-800";
            }

            return (
              <button
                key={choice.id}
                onClick={() => pick(choice.id)}
                disabled={picked !== null}
                className={`rounded-xl border-2 px-4 py-3.5 text-left text-base transition-colors ${tone}`}
              >
                {choice.text}
              </button>
            );
          })}
        </div>
      </div>

      {picked && (
        <div className="flex flex-col gap-4 border-t border-neutral-200 pt-5 dark:border-neutral-800">
          <div>
            <p
              className={`font-semibold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}
            >
              {isCorrect ? `정답 +${xpFor(question)} XP` : "오답"}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {question.explanation}
            </p>
          </div>
          <button
            onClick={next}
            className="rounded-xl bg-neutral-900 py-4 text-base font-semibold text-white dark:bg-white dark:text-neutral-900"
          >
            {index + 1 >= deck.length ? "결과 보기" : "다음"}
          </button>
        </div>
      )}
    </main>
  );
}
