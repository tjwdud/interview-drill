import type { Concept, Question } from "@/shared/api";
import { lastSeenAt, priorityOf, type Progress } from "@/entities/progress";

/**
 * 세션에 낼 문항을 고른다.
 *
 * 1. 개념을 출제 우선순위 내림차순으로 정렬
 * 2. 각 개념 안에서는 가장 오래전에 나온 문항부터
 * 3. 개념을 한 바퀴씩 돌며 뽑는다 — 한 개념에서 연달아 나오지 않게
 */
export function buildDeck(
  questions: Question[],
  concepts: Concept[],
  progress: Progress,
  size: number,
  now: Date = new Date(),
): Question[] {
  const queues = [...concepts]
    .sort((a, b) => priorityOf(progress, b.id, now) - priorityOf(progress, a.id, now))
    .map((concept) =>
      questions
        .filter((question) => question.conceptId === concept.id)
        .sort((a, b) => lastSeenAt(progress, a.id) - lastSeenAt(progress, b.id)),
    );

  const deck: Question[] = [];
  const depth = Math.max(0, ...queues.map((queue) => queue.length));

  for (let round = 0; round < depth && deck.length < size; round += 1) {
    for (const queue of queues) {
      if (deck.length >= size) break;
      const question = queue[round];
      if (question) deck.push(question);
    }
  }

  return deck;
}
