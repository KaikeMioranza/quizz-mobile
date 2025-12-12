import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabsLayout() {
  return (
      <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={'home-sharp'} color={color} size={24} />
          ),
        }}
      />
     <Tabs.Screen
        name="Quizz"
        options={{
          tabBarIcon: ({ color }) =>
            // ❌ Era color="black"
            <MaterialIcons name="home" size={24} color={"white"} /> // ✅ AGORA USA {color}
        }}
      />
    </Tabs>
  );
}
