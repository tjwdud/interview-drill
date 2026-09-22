# interview-drill

듀오링고 스타일로 기술면접 질문을 반복 훈련하는 웹앱.

## 스택

- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS 4
- 패키지 매니저: pnpm

## 실행

```bash
pnpm dev     # 개발 서버
pnpm build   # 프로덕션 빌드
pnpm lint
```

## 핵심 루프 (설계 목표)

1. 레슨 = 문항 5~10개
2. 문항마다 즉시 정답 피드백
3. 틀린 문항은 간격 반복(SRS)으로 재등장
4. 스트릭 / XP로 매일 돌아오게 만들기

## 아직 정해지지 않은 것

- **콘텐츠 범위**: 프론트엔드 단일 트랙 / CS 기초 포함 여부
- **진도 저장**: localStorage / 서버 DB
- **배포**: Vercel 유력

## 계정 설정

이 레포는 개인 계정(`tjwdud`)으로 고정되어 있습니다. 글로벌 기본값은 회사 계정이며,
`.git/config`의 `user` / `credential` 항목이 이 레포에서만 이를 덮어씁니다.
