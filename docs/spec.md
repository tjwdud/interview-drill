# interview-drill 스펙

작성 2026-09-23 · MVP 대상

## 한 줄 정의

3~4년차 프론트엔드 개발자가 기술면접을 대비하는, 듀오링고식 반복 학습 웹앱.

단순 문제은행이 아니라 **짧게 풀고 → 즉시 피드백 → 약한 개념이 다시 출제되는** 루프가 핵심이다.

## 타깃

프론트엔드 3~4년차, 이직 준비 중. 개념은 어느 정도 알지만 정확히 설명하지 못하거나 헷갈리는 사람.
입문 강의가 아니라 **"아는 걸 꺼낼 수 있게 만드는 훈련"** 도구다.

처음에는 본인만 사용하고, 이후 공개할 수 있게 만든다. 따라서 진도 저장은 서버로 옮길 수 있는 형태여야 한다.

## MVP 범위

| 포함 | 제외 |
|---|---|
| React · JavaScript 2개 트랙 | 나머지 8개 트랙 |
| 객관식 4지선다 | 서술형 답변, 셀프 채점 |
| XP, 개념별 숙련도 | 스트릭, 랭킹, 공유 |
| 약한 개념 재출제 | 스킬 트리, 해금 |
| localStorage | 로그인, 서버 DB |
| 오답 시 해설 한 줄 | 오답 선택지별 개별 진단 |

**런타임에 LLM을 호출하지 않는다.** 문항은 저작 단계에서 Claude Code로 생성하고 검수해 JSON으로 커밋한다.
따라서 API 키가 앱에 들어가지 않고, 공개해도 사용자 수에 비례하는 비용이 없다.

## 화면

### 홈

- `오늘의 세션 시작` 버튼 하나
- 개념별 숙련도 목록 (약한 순). 이 목록이 오답 모음집 역할을 겸한다

별도의 오답 노트 화면은 만들지 않는다. 연습 종류가 하나뿐이라 분리할 이유가 없다.

### 세션

- 한 화면에 한 문제만
- 보기 4개 중 하나 선택 → 즉시 채점
- 정답: `✅ +10 XP` + 해설 한 줄
- 오답: `❌` + 정답 표시 + 해설 한 줄
- `다음` 으로 진행. 이전 문제로 돌아가지 않는다

### 결과

- 맞은 개수 / 총 문항
- 획득 XP
- 이번 세션에서 틀린 개념 목록

## 데이터 모델

### 문항 (정적 JSON, 커밋됨)

```ts
type Question = {
  id: string;            // "q-012"
  conceptId: string;     // "react-batching"
  level: 1 | 2 | 3 | 4 | 5;
  code?: string;         // 코드 블록 (없을 수 있음)
  prompt: string;        // 질문 한 줄
  choices: Choice[];     // 4개
  answerId: string;
  explanation: string;   // 해설 한 줄
};

type Choice = {
  id: string;            // "a" | "b" | "c" | "d"
  text: string;
  // misconception?: string  ← 오답별 진단. MVP에서는 비워둠
};
```

`Choice`를 객체로 두는 이유는, 나중에 오답별 진단을 붙일 때 스키마 변경 없이 필드만 채우면 되기 때문이다. 지금 드는 비용은 없다.

### 개념

```ts
type Concept = {
  id: string;            // "react-batching"
  trackId: "react" | "javascript";
  name: string;          // "Batching"
};
```

### 진도 (localStorage)

```ts
type Progress = {
  xp: number;
  concepts: Record<string, ConceptProgress>;
  seenQuestions: Record<string, string>;  // questionId -> 마지막 출제 ISO 날짜
};

type ConceptProgress = {
  attempts: number;
  correct: number;
  lastSeenAt: string;    // ISO 날짜
};
```

문항 단위 기록(`seenQuestions`)과 개념 단위 집계(`concepts`)를 분리한다. 화면과 숙련도는 개념 단위로 보여주고, 같은 문항이 연달아 나오는 것만 문항 기록으로 막는다.

## 숙련도와 출제 규칙

### 숙련도

```
mastery = correct / attempts
```

한 번도 안 푼 개념은 `mastery = 0.5`(중립)로 간주한다.

### 출제 우선순위

```
daysSince = 오늘 - lastSeenAt   (미학습이면 7)
priority  = (1 - mastery) + min(daysSince, 14) / 14 * 0.5
```

숙련도가 낮을수록, 오래 안 봤을수록 우선순위가 높다. 최댓값은 1.5다.

### 세션 구성

1. 모든 개념을 `priority` 내림차순 정렬
2. 위에서부터 개념을 뽑고, 각 개념에서 문항 1개씩 선택
3. 문항은 `seenQuestions`에서 **가장 오래전에 나온 것** 우선. 같은 세션에 같은 문항은 넣지 않는다
4. 기본 5문항, 최대 10문항

같은 개념을 다시 낼 때 **같은 문항을 내지 않는 것**이 규칙의 핵심이다. 같은 문항이 돌아오면 개념이 아니라 답을 외우게 된다.

### XP

```
정답            +10
Lv.4~5 정답     +15
연속 3정답      +5 (보너스, 3의 배수마다)
```

## 문항 저작

- 개념 10개 (React 5 / JavaScript 5), 개념당 3문항 = **30문항**
- Claude Code 세션에서 생성 → 사람이 검수 → `src/shared/data/questions.json` 커밋
- 오답 보기는 "일부는 맞는데 결정적으로 한 군데가 틀린" 형태로 만든다. 명백히 틀린 보기는 개념 이해를 검증하지 못한다

화면을 먼저 만들고, 그 위에서 샘플 3문항으로 형태를 확인한 뒤 30개를 채운다.

## 기술

- Next.js 16 App Router / React 19 / TypeScript / Tailwind 4 / pnpm
- 구조: Feature-Sliced Design v2.1. Next 라우팅 폴더와 이름이 겹치므로 FSD 레이어는 `src/_app/`, `src/_pages/`로 둔다
- 시작 레이어는 `_app` / `_pages` / `shared` 셋. `features` / `entities`는 실제로 두 곳 이상에서 쓰이는 게 생겼을 때만 만든다
- 배포 미정. Vercel과 GitHub Pages 모두 가능하다. 나중에 세션 코치 같은 서버 기능을 붙일 생각이면 Vercel이 유리하다

## 미결정

- 개념 10개가 무엇인지
- 배포 대상
- 트랙 레벨 표시(`React Lv.4`)를 숙련도 집계에서 어떻게 계산할지. MVP에는 넣지 않는다

## 나중에

우선순위 순.

1. 오답 선택지별 진단 (`Choice.misconception` 채우기)
2. 세션 종료 시 AI 코치 3줄 — 서버 필요
3. Lv.4~5 서술형 답변 AI 채점
4. 트랙 확장 (Browser, Network, Performance ...)
5. 로그인 + 진도 서버 동기화
