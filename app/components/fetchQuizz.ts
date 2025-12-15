// api/quiz.ts
export function fetchQuiz() {
  return Promise.resolve({
    questions: [
      {
        id: "q1",
        question: "Em que ano a Jumbo foi criada?",
        timeLimit: 10,
        options: [
          { key: "A", text: "1988" },
          { key: "B", text: "1995" },
          { key: "C", text: "2001" },
          { key: "D", text: "2010" },
        ],
        correct: "A",
      },
      {
        id: "q2",
        question: "Qual linguagem é usada no React Native?",
        timeLimit: 10,
        options: [
          { key: "A", text: "Java" },
          { key: "B", text: "Kotlin" },
          { key: "C", text: "JavaScript" },
          { key: "D", text: "Swift" },
        ],
        correct: "C",
      },
    ],
  });
}
