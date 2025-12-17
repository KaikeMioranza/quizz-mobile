import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button, Card, Dialog, Portal, Text, ProgressBar, Divider, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trophy, Clock, Calendar, DollarSign, ChevronRight } from "lucide-react-native";

// --- 1. TIPAGEM ---
interface QuizOption { key: string; text: string; }
interface Question { id: string; question: string; timeLimit: number; options: QuizOption[]; correct: string; }

interface QuizHistory {
  quizId: string;
  date: string;
  score: number;
  total: number;
  duration: number;
  creditoFlex: number;
}

interface QuestionDialogProps {
  question: Question | undefined;
  currentIndex: number;
  total: number;
  progress: number;
  timeLeft: number;
  getTimerColor: (time: number) => string;
  onSelect: (answer: string) => void;
  selectedAnswer: string | null;
}

// --- 2. COMPONENTE DE PERGUNTA ---
const QuestionDialog = React.memo(({ 
  question, currentIndex, total, progress, timeLeft, getTimerColor, onSelect, selectedAnswer 
}: QuestionDialogProps) => {
  if (!question) return null;
  return (
    <Portal>
      <Dialog visible dismissable={false} style={styles.dialog}>
        <View style={styles.dialogHeader}>
          <Text style={styles.questionCounter}>Pergunta {currentIndex + 1} de {total}</Text>
          <View style={styles.timerContainer}>
            <Clock size={16} color={getTimerColor(timeLeft)} />
            <Text style={[styles.timerText, { color: getTimerColor(timeLeft) }]}>{timeLeft}s</Text>
          </View>
        </View>
        <ProgressBar progress={progress} color="#1A5FC0" style={styles.progressBar} />
        <Dialog.Title style={styles.questionTitle}>{question.question}</Dialog.Title>
        <Dialog.Content>
          {question.options.map((opt) => (
            <Button
              key={opt.key}
              mode={selectedAnswer === opt.key ? "contained" : "outlined"}
              onPress={() => onSelect(opt.key)}
              style={[styles.optionButton, selectedAnswer === opt.key && styles.selectedOption]}
              buttonColor={selectedAnswer === opt.key ? "#1A5FC0" : "transparent"}
              textColor={selectedAnswer === opt.key ? "#fff" : "#374151"}
            >
              {opt.key} {opt.text}
            </Button>
          ))}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
});

// --- 3. COMPONENTE PRINCIPAL ---
export default function Quizz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchQuiz().then((data) => setQuestions(data.questions));
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem("quizHistory");
    if (stored) setHistory(JSON.parse(stored));
  };

  useEffect(() => {
    if (!started || finished) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleNextQuestion(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, finished, currentIndex]);

  const saveHistory = async (finalAnswers: Record<string, string>) => {
    if (!startTimeRef.current) return;
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const score = questions.filter((q) => finalAnswers[q.id] === q.correct).length;
    
    const record: QuizHistory = {
      quizId: `ID-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR'),
      score,
      total: questions.length,
      duration,
      creditoFlex: score * 10, // Ex: R$ 10 por acerto
    };

    const newHistory = [record, ...history];
    await AsyncStorage.setItem("quizHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
  };

  const handleNextQuestion = useCallback((answer?: string) => {
    const updatedAnswers = { ...answers };
    if (answer) updatedAnswers[questions[currentIndex].id] = answer;
    setAnswers(updatedAnswers);

    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      setStarted(false);
      saveHistory(updatedAnswers);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(questions[currentIndex + 1].timeLimit);
    }
  }, [currentIndex, questions, answers]);

  const startQuiz = () => {
    startTimeRef.current = Date.now();
    setStarted(true);
    setFinished(false);
    setCurrentIndex(0);
    setAnswers({});
    setSelectedAnswer(null);
    setTimeLeft(questions[0].timeLimit);
  };

  const progress = useMemo(() => questions.length > 0 ? (currentIndex + 1) / questions.length : 0, [currentIndex, questions.length]);
  const getTimerColor = (time: number) => time >= 7 ? "#22c55e" : time >= 4 ? "#eab308" : "#ef4444";

  return (
    <View style={styles.container}>
      {!started && !finished && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.mainCard}>
            <Card.Content style={styles.alignCenter}>
              <Trophy size={50} color="#1A5FC0" />
              <Text style={styles.title}>Quizz</Text>
              <Button mode="contained" onPress={startQuiz} style={styles.startBtn}>Iniciar</Button>
            </Card.Content>
          </Card>

          <Text style={styles.historyTitle}>Histórico de Créditos</Text>
          {history.map((item, index) => (
            <Card key={index} style={styles.historyCard}>
              <List.Item
                title={`Data ${item.date}`}
                description={`${item.score}/${item.total} acertos • ${item.duration}s`}
                left={props => <List.Icon {...props} icon="currency-usd" color="#22c55e" />}
                right={() => <Text style={styles.historyCredit}>+ R$ {item.creditoFlex.toFixed(2)}</Text>}
              />
            </Card>
          ))}
        </ScrollView>
      )}

      {started && (
        <QuestionDialog
          question={questions[currentIndex]} currentIndex={currentIndex}
          total={questions.length} progress={progress} timeLeft={timeLeft}
          getTimerColor={getTimerColor} selectedAnswer={selectedAnswer}
          onSelect={(ans) => { setSelectedAnswer(ans); handleNextQuestion(ans); }}
        />
      )}

      {finished && (
        <View style={styles.centerAll}>
          <Trophy size={80} color="#f59e0b" />
          <Text style={styles.title}>Quiz Finalizado!</Text>
          <Text style={styles.subtitle}>Você ganhou R$ {history[0]?.creditoFlex.toFixed(2)}</Text>
          <Button mode="outlined" onPress={() => setFinished(false)} style={{marginTop: 20}}>Ver Histórico</Button>
        </View>
      )}
    </View>
  );
}

// --- 4. ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContent: { padding: 20 },
  mainCard: { borderRadius: 15, elevation: 4, marginBottom: 25 },
  alignCenter: { alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  startBtn: { width: '100%', marginTop: 10 },
  historyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#374151' },
  historyCard: { marginBottom: 10, borderRadius: 10 },
  historyCredit: { alignSelf: 'center', fontWeight: 'bold', color: '#22c55e', fontSize: 16, marginRight: 10 },
  dialog: { borderRadius: 20, backgroundColor: '#fff' },
  dialogHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  questionCounter: { color: '#6B7280' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 5, borderRadius: 8 },
  timerText: { marginLeft: 5, fontWeight: 'bold' },
  progressBar: { height: 6, marginHorizontal: 20 },
  questionTitle: { fontSize: 18, paddingHorizontal: 10 },
  optionButton: { marginBottom: 10, marginHorizontal: 10, borderRadius: 8 },
  selectedOption: { borderColor: '#1A5FC0' },
  centerAll: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  subtitle: { fontSize: 18, color: '#4B5563' }
});

async function fetchQuiz() {
  return {
    questions: [
      { id: "q1", question: "Em que ano a Jumbo foi criada?", timeLimit: 10, options: [{ key: "A", text: "1988" }, { key: "B", text: "1995" },{ key: "C", text: "1998" }, { key: "D", text: "1989" }], correct: "A" },
      { id: "q2", question: "Qual o fornecedor principal?", timeLimit: 10, options: [{ key: "A", text: "Duduxo" }, { key: "B", text: "Bem Brasil" },{ key: "C", text: "Aurora" }, { key: "D", text: "Do Vale" }], correct: "B" },
      { id: "q3", question: "Além de Cascavel, em qual cidade paranaense a Jumbo possui uma filial física?", timeLimit: 10, options: [{ key: "A", text: "Londrina" }, { key: "B", text: "Foz do Iguaçu" }, { key: "C", text: "Toledo" }, { key: "D", text: "Guarapuava" }], correct: "A" },
      { id: "q4", question: "Qual destas marcas é uma das representações exclusivas da Jumbo Alimentos?", timeLimit: 10, options: [{ key: "A", text: "Sadia" }, { key: "B", text: "Perdigão" }, { key: "C", text: "Bem Brasil" }, { key: "D", text: "Seara" }], correct: "C" },
      { id: "q5", question: "A Jumbo Alimentos atua em quantas cidades aproximadamente?", timeLimit: 10, options: [{ key: "A", text: "150 cidades" }, { key: "B", text: "318 cidades" }, { key: "C", text: "500 cidades" }, { key: "D", text: "100 cidades" }], correct: "B" },
      { id: "q6", question: "Além do Paraná, em quais outros estados a Jumbo Alimentos atua?", timeLimit: 10, options: [{ key: "A", text: "Santa Catarina e RS" }, { key: "B", text: "São Paulo e MS" }, { key: "C", text: "Minas Gerais e RJ" }, { key: "D", text: "Goiás e Mato Grosso" }], correct: "B" },
      { id: "q7", question: "Qual marca parceira da Jumbo é focada em produtos de açaí e frutas?", timeLimit: 10, options: [{ key: "A", text: "Aurora" }, { key: "B", text: "Massa da Boa" }, { key: "C", text: "Frooty" }, { key: "D", text: "Bem Brasil" }], correct: "C" },
      { id: "q8", question: "Aproximadamente quantos clientes ativos a Jumbo possui em seu cadastro?", timeLimit: 10, options: [{ key: "A", text: "Mais de 10.000" }, { key: "B", text: "Cerca de 5.000" }, { key: "C", text: "Aproximadamente 2.000" }, { key: "D", text: "Mais de 50.000" }], correct: "A" },
      { id: "q9", question: "Qual o DDD do telefone fixo da unidade de Londrina?", timeLimit: 10, options: [{ key: "A", text: "(45)" }, { key: "B", text: "(41)" }, { key: "C", text: "(43)" }, { key: "D", text: "(44)" }], correct: "C" },
      { id: "q10", question: "Quantos produtos catalogados a Jumbo Alimentos oferece aproximadamente?", timeLimit: 10, options: [{ key: "A", text: "150 produtos" }, { key: "B", text: "450 produtos" }, { key: "C", text: "1.000 produtos" }, { key: "D", text: "800 produtos" }], correct: "B" }
    ],
  };
}