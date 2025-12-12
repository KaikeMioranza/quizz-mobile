import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [logged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLogged(false); // simula não logado
    }, 800);
  }, []);

  if (logged === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 👇 Aqui está o segredo: escolhe qual GRUPO renderizar
  return (
    <Slot
      // redireciona automaticamente para o grupo certo
      screenOptions={{
        // expo-router identifica o grupo (auth) ou (tabs) sozinho
      }}
    />
  );
}
