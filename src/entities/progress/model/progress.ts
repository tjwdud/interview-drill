import { readJson, writeJson } from "@/shared/lib";

const STORAGE_KEY = "interview-drill:progress";

/** 한 번도 풀지 않은 개념의 숙련도. 중립값. */
const NEUTRAL_MASTERY = 0.5;
/** 한 번도 풀지 않은 개념의 경과일 가정치. */
const NEUTRAL_DAYS = 7;
/** 경과일 보정이 최대가 되는 일수. */
const MAX_DAYS = 14;
/** 우선순위에서 경과일이 차지하는 비중. */
const RECENCY_WEIGHT = 0.5;

const DAY_MS = 24 * 60 * 60 * 1000;

export type ConceptProgress = {
  attempts: number;
  correct: number;
  lastSeenAt: string;
};

export type Progress = {
  xp: number;
  concepts: Record<string, ConceptProgress>;
  /** 문항 id -> 마지막으로 출제된 시각. 같은 문항이 연달아 나오는 걸 막는다. */
  seenQuestions: Record<string, string>;
};

export type AnswerResult = {
  questionId: string;
  conceptId: string;
  correct: boolean;
  xp: number;
};

export const emptyProgress: Progress = {
  xp: 0,
  concepts: {},
  seenQuestions: {},
};

export function loadProgress(): Progress {
  return readJson(STORAGE_KEY, emptyProgress);
}

export function saveProgress(progress: Progress): void {
  writeJson(STORAGE_KEY, progress);
}

/** 숙련도 = 정답수 / 시도수. 안 푼 개념은 중립값. */
export function masteryOf(progress: Progress, conceptId: string): number {
  const record = progress.concepts[conceptId];
  if (!record || record.attempts === 0) return NEUTRAL_MASTERY;
  return record.correct / record.attempts;
}

export function attemptsOf(progress: Progress, conceptId: string): number {
  return progress.concepts[conceptId]?.attempts ?? 0;
}

function daysSince(iso: string | undefined, now: Date): number {
  if (!iso) return NEUTRAL_DAYS;
  return Math.max(0, (now.getTime() - new Date(iso).getTime()) / DAY_MS);
}

/**
 * 출제 우선순위. 숙련도가 낮을수록, 오래 안 봤을수록 높다. 최대 1.5.
 * (1 - 숙련도) + min(경과일, 14) / 14 * 0.5
 */
export function priorityOf(
  progress: Progress,
  conceptId: string,
  now: Date = new Date(),
): number {
  const recency = Math.min(
    daysSince(progress.concepts[conceptId]?.lastSeenAt, now),
    MAX_DAYS,
  );
  return (1 - masteryOf(progress, conceptId)) + (recency / MAX_DAYS) * RECENCY_WEIGHT;
}

/** 문항이 마지막으로 출제된 시각. 안 나온 문항은 0이라 먼저 뽑힌다. */
export function lastSeenAt(progress: Progress, questionId: string): number {
  const iso = progress.seenQuestions[questionId];
  return iso ? new Date(iso).getTime() : 0;
}

/** 한 문항의 결과를 반영한 새 진도를 돌려준다. 원본은 건드리지 않는다. */
export function recordAnswer(
  progress: Progress,
  result: AnswerResult,
  now: Date = new Date(),
): Progress {
  const previous = progress.concepts[result.conceptId];
  const timestamp = now.toISOString();

  return {
    xp: progress.xp + result.xp,
    concepts: {
      ...progress.concepts,
      [result.conceptId]: {
        attempts: (previous?.attempts ?? 0) + 1,
        correct: (previous?.correct ?? 0) + (result.correct ? 1 : 0),
        lastSeenAt: timestamp,
      },
    },
    seenQuestions: {
      ...progress.seenQuestions,
      [result.questionId]: timestamp,
    },
  };
}
