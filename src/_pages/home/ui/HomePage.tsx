import Link from "next/link";
import { questions } from "@/shared/api";

export function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-10 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">interview-drill</h1>
        <p className="mt-2 text-neutral-500">
          하루 5분, 헷갈리는 개념만 골라서.
        </p>
      </div>

      <Link
        href="/session"
        className="rounded-2xl bg-emerald-500 py-5 text-center text-lg font-semibold text-white"
      >
        오늘의 세션 시작
      </Link>

      <p className="text-sm text-neutral-500">
        문항 {questions.length}개 · 개념별 숙련도는 다음 단계에서 붙습니다.
      </p>
    </main>
  );
}
