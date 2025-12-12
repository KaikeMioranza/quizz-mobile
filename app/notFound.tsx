import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFound() {
    return(
        <>
            <Stack.Screen options={{ title:"Pagina não encontrada"}}/>
            <View>
                <Link href="/(tabs)/home" style={styles.button}>
                    Voltar para tela de Login
                </Link>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});