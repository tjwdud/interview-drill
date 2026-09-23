export type Level = 1 | 2 | 3 | 4 | 5;

export type Choice = {
  id: string;
  text: string;
  /** 이 보기를 고른 사람의 오개념. MVP에서는 비워둔다. */
  misconception?: string;
};

export type Question = {
  id: string;
  conceptId: string;
  level: Level;
  code?: string;
  prompt: string;
  choices: Choice[];
  answerId: string;
  explanation: string;
};

export type Concept = {
  id: string;
  trackId: "react" | "javascript";
  name: string;
};
