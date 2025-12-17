import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import { Star, Bell, Award, Home as HomeIcon, HelpCircle } from 'lucide-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {
  const [gratitudeToday, setGratitudeToday] = useState(false);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
 
  interface QuizHistory {
  score: number;
  total: number;
  creditoFlex: number;
  }

  useFocusEffect(
    React.useCallback(() => {
      loadGlobalStats();
    }, [])
  );

  const loadGlobalStats = async () => {
    const stored = await AsyncStorage.getItem("quizHistory");
    if (stored) {
      const history: QuizHistory[] = JSON.parse(stored);
      
      // 1. Quantidade de quizzes é o tamanho do array
      setTotalQuizzes(history.length);

      // 2. Soma de todos os acertos usando reduce
      const correctSum = history.reduce((acc, curr) => acc + curr.score, 0);
      setTotalCorrect(correctSum);

      // 3. Soma do crédito total acumulado
      const creditSum = history.reduce((acc, curr) => acc + curr.creditoFlex, 0);
      setTotalCredit(creditSum);
    }
  };
  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.gratitudeCard}>
          <Card.Title
            title="Você já agradeceu hoje?"
            titleStyle={styles.cardTitleText}
            left={(props) => (
              <View style={styles.iconContainer}>
                <Star size={24} color="#fff" fill="#fff" />
              </View>
            )}
          />
          
          <Card.Content>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>
                Gratidão não é somente a maior das virtudes, é também a mãe de todas as outras que possam me acompanhar!
              </Text>
            </View>

          </Card.Content>
        </Card>

        <Card style={styles.alertCard}>
          <Card.Title
            title="Avisos importantes"
            titleStyle={styles.alertTitle}
            left={(props) => (
              <View style={styles.alertIconContainer}>
                <Bell size={20} color="#ea580c" />
              </View>
            )}
          />
          
          <Card.Content>
            <View style={styles.alertContent}>
              <View style={styles.alertDot} />
              <Text style={styles.alertText}>Conta corrente zera no dia 01/09</Text>
            </View>
            
            <View style={styles.spacer12}/>
            
            <View style={styles.alertContent}>
              <View style={styles.alertDot} />
              <Text style={styles.alertText}>Dia 24 não haverá faturamento</Text>
            </View>
            
          </Card.Content>
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Star size={24} color="rgba(26, 95, 192, 1)" fill="rgba(26, 95, 192, 1)" />
              <Text style={styles.statNumber}>{totalQuizzes}</Text>
              <Text style={styles.statLabel}>Quizz respondidos</Text>
            </Card.Content>
          </Card>

          <View style={styles.spacer16} />

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Award size={24} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.statNumber}>{totalCorrect}</Text>
              <Text style={styles.statLabel}>Total de acertos</Text>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  gratitudeCard: {
    backgroundColor: "rgba(26, 95, 192, 1)",
    borderRadius: 24,
    marginBottom: 24,
    elevation: 8,
  },
  cardTitleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 12,
    marginLeft: 4,
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  quoteText: {
    fontSize: 15,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: "rgba(26, 95, 192, 1)",
  },
  successBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 24,
    elevation: 3,
    
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  alertIconContainer: {
    backgroundColor: '#fed7aa',
    padding: 8,
    borderRadius: 12,
    marginLeft: 6,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderLeftWidth: 3,
    borderLeftColor: '#f97316',
    padding: 16,
    borderRadius: 12,
    elevation:2,
    
  },
  alertDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f97316',
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 15,
    color: '#c2410c',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 100,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 3,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    marginTop: -8,
  },
  navLabelActive: {
    color: "rgba(26, 95, 192, 1)",
    fontWeight: '600',
  },
  spacer16: {
    width: 16,
  },
  spacer12: {
    height:12,
  },
});