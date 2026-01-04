import { Tabs } from 'expo-router';
import { HelpCircle, Home } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quizz"
        options={{
          title: 'Iniciar Quizz',
          tabBarIcon: ({ color }) => <HelpCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}