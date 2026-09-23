import type { Question } from "./question";

export const questions: Question[] = [
  {
    id: "q-001",
    conceptId: "react-state-snapshot",
    level: 1,
    code: `function handleClick() {
  setCount(1);
  console.log(count);
}`,
    prompt: "count가 0인 상태에서 버튼을 눌렀을 때, console에 찍히는 값은?",
    choices: [
      { id: "a", text: "1" },
      { id: "b", text: "0" },
      { id: "c", text: "undefined" },
      { id: "d", text: "리렌더 타이밍에 따라 0 또는 1" },
    ],
    answerId: "b",
    explanation:
      "state는 렌더 시점의 스냅샷이다. setCount는 다음 렌더를 예약할 뿐, 지금 렌더의 count 변수를 바꾸지 않는다.",
  },
  {
    id: "q-002",
    conceptId: "react-batching",
    level: 3,
    code: `const [count, setCount] = useState(0);

function handleClick() {
  setCount(c => c + 1);
  setCount(count + 1);
  setCount(c => c + 1);
}`,
    prompt: "count가 0일 때 버튼을 한 번 클릭하면 최종 count는?",
    choices: [
      { id: "a", text: "3" },
      { id: "b", text: "2" },
      { id: "c", text: "1" },
      { id: "d", text: "3이지만 리렌더는 한 번만 일어난다" },
    ],
    answerId: "b",
    explanation:
      "큐에는 [+1 함수, 값 1, +1 함수]가 쌓인다. 값 기반 업데이트의 count는 렌더 시점 값 0이라 앞의 결과를 덮어써 1이 되고, 마지막 함수형 업데이트가 2로 만든다.",
  },
  {
    id: "q-003",
    conceptId: "js-closure",
    level: 2,
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    prompt: "출력 결과는?",
    choices: [
      { id: "a", text: "0 1 2" },
      { id: "b", text: "3 3 3" },
      { id: "c", text: "0 0 0" },
      { id: "d", text: "2 2 2" },
    ],
    answerId: "b",
    explanation:
      "var는 함수 스코프라 세 콜백이 같은 i 하나를 참조한다. 타이머가 실행될 시점엔 루프가 끝나 i가 3이다.",
  },
];
