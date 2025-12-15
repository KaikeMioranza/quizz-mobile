import { Redirect, Slot } from "expo-router";
import { useEffect, useState } from "react";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const [logged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLogged(false); // simula auth
    }, 800);
  }, []);

  if (logged === null) {
    return null; // splash / loading
  }

  return (
    <PaperProvider>
      {logged ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />}
      <Slot />
    </PaperProvider>
  );
}
