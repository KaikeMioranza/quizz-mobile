import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import MyAppBar from '../components/Appbar';

export default function Home() {
  return (
    <View
      style={styles.container}
    >
      <Link href={"/home"} style={styles.text}> Home</Link>
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