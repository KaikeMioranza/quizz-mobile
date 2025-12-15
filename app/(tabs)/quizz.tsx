import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  List,
  Portal,
  Text,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 🔹 Simulação da API
 */
async function fetchQuiz() {
  return {
    questions: [
      {
        id: "q1",
        question: "Em que ano a Jumbo foi criada?",
        timeLimit: 10,
        options: [
          { key: "A", text: "1988" },
          { key: "B", text: "1995" },
          { key: "C", text: "1997" },
          { key: "D", text: "1987" },
        ],
        correct: "A",
      },
      {
        id: "q2",
        question: "Qual o fornecedor principal da Jumbo?",
        timeLimit: 10,
        options: [
          { key: "A", text: "Duduxo" },
          { key: "B", text: "Aurora" },
          { key: "C", text: "Bem Brasil" },
          { key: "D", text: "Do Vale" },
        ],
        correct: "C",
      },
    ],
  };
}

type QuizHistory = {
  quizId: string;
  date: string;
  score: number;
  total: number;
  answers: Record<string, string>;
  duration: number;
};

export default function Quizz() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [history, setHistory] = useState<QuizHistory[]>([]);

  /**
   * 📡 Carregar quiz
   */
  useEffect(() => {
    fetchQuiz().then((data) => setQuestions(data.questions));
  }, []);

  /**
   * 📦 Carregar histórico salvo
   */
  useEffect(() => {
    AsyncStorage.getItem("quizHistory").then((stored) => {
      if (stored) setHistory(JSON.parse(stored));
    });
  }, []);

  /**
   * ⏱ Tempo total gasto
   */
  useEffect(() => {
    if (!started || finished) return;

    const timer = setTimeout(() => {
      setTotalTimeSpent((t) => t + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [started, finished, totalTimeSpent]);

  /**
   * ⏳ Timer por pergunta
   */
  useEffect(() => {
    if (!started || finished) return;

    if (timeLeft === 0) {
      nextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, started, finished]);

  function startQuiz() {
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setAnswers({});
    setTotalTimeSpent(0);
    setTimeLeft(questions[0].timeLimit);
  }

  function calculateScore() {
    return questions.filter(
      (q) => answers[q.id] === q.correct
    ).length;
  }

  function colorDialog() {
    if (timeLeft >= 7) return "#669c46ff";
    if (timeLeft >= 4) return "#a89f1dff";
    return "#9c5746ff";
  }

  async function saveHistory() {
    const record: QuizHistory = {
      quizId: "quiz-001",
      date: new Date().toISOString(),
      score: calculateScore(),
      total: questions.length,
      answers,
      duration: totalTimeSpent,
    };

    const stored = await AsyncStorage.getItem("quizHistory");
    const list: QuizHistory[] = stored ? JSON.parse(stored) : [];

    list.push(record);

    await AsyncStorage.setItem("quizHistory", JSON.stringify(list));
    setHistory(list);
  }

  function nextQuestion(answer?: string) {
    const current = questions[currentIndex];

    if (answer) {
      setAnswers((prev) => ({
        ...prev,
        [current.id]: answer,
      }));
    }

    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      saveHistory();
      return;
    }

    setCurrentIndex((i) => i + 1);
    setTimeLeft(questions[currentIndex + 1].timeLimit);
  }

  function QuestionDialog() {
    const q = questions[currentIndex];
    if (!q) return null;

    return (
      <Portal>
        <Dialog
          visible
          dismissable={false}
          style={{ backgroundColor: colorDialog() }}
        >
          <Dialog.Title>{q.question}</Dialog.Title>

          <Dialog.Content>
            <Text style={{ marginBottom: 8 }}>
              Tempo restante: {timeLeft}s
            </Text>

            {q.options.map((opt: any) => (
              <List.Item
                key={opt.key}
                title={`${opt.key}) ${opt.text}`}
                onPress={() => nextQuestion(opt.key)}
                left={() => (
                  <Checkbox
                    status={
                      answers[q.id] === opt.key
                        ? "checked"
                        : "unchecked"
                    }
                  />
                )}
              />
            ))}
          </Dialog.Content>
        </Dialog>
      </Portal>
    );
  }

  function Result() {
    return (
      <ScrollView style={{ padding: 16 }}>
        {history.map((h, i) => (
          <Card key={i} style={{ marginBottom: 12 }}>
            <Card.Content>
              <Text>Quiz: {h.quizId}</Text>
              <Text>Data: {new Date(h.date).toLocaleString()}</Text>
              <Text>
                Pontuação: {h.score}/{h.total}
              </Text>
              <Text>Duração: {h.duration}s</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      {!started && !finished && questions.length > 0 && (
        <Button
          mode="contained"
          buttonColor="#208169ff"
          onPress={startQuiz}
        >
          Começar Quiz
        </Button>
      )}

      {started && !finished && <QuestionDialog />}

      {finished && <Result />}
    </View>
  );
}
