import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const [logged, setLogged] = useState<boolean>(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Pequeno delay para garantir que o roteador nativo carregou as pastas
    const timer = setTimeout(() => setIsReady(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Enquanto o app inicializa, não renderize nada (mostra a Splash Screen)
  if (!isReady) return null;

  return (
    <PaperProvider>
      {/* O Redirect DEVE ser o retorno único. Remova o <Slot /> daqui */}
      {logged ? (
        <Redirect href="/(tabs)/home" />
      ) : (
        <Redirect href="/(auth)/login" />
      )}
    </PaperProvider>
  );
}