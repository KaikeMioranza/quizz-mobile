import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function twoScreen() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>Kaike Mioranza</Text>
      <Link href={"/twoScreen"}>Teste2</Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});