import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-sharp" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="quizz"
        options={{
          title: "Iniciar Quizz",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="quiz" size={24} color={color} />
          ),
        }}
      />
    </Tabs>

  );
}
