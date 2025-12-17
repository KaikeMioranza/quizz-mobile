import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { TextInput, Button, Text, HelperText } from "react-native-paper";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");
  
  const validateEmail = (email?:any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  async function clearQuizHistoryStorage() {
    await AsyncStorage.removeItem("quizHistory");
  }
  const handleLogin = async () => {
    // Resetar erros
    setEmailError("");
    setSenhaError("");

    // Validações
    let hasError = false;

    if (!email) {
      setEmailError("Email é obrigatório");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Email inválido");
      hasError = true;
    }

    if (!senha) {
      setSenhaError("Senha é obrigatória");
      hasError = true;
    } else if (senha.length < 6) {
      setSenhaError("Senha deve ter no mínimo 6 caracteres");
      hasError = true;
    }

    if (hasError) return;
   

    setTimeout(async () => {
      setLoading(false);

      await clearQuizHistoryStorage();
      router.replace("/(tabs)/home");
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <LogIn size={40} color="rgba(51, 26, 192, 1)" />
            </View>
          </View>
          <Text style={styles.title}>Bem-vindo de volta! 👋</Text>
          <Text style={styles.subtitle}>Entre para continuar sua jornada</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              mode="outlined"
              style={styles.input}
              outlineColor="#e5e7eb"
              activeOutlineColor="rgba(51, 26, 192, 1)"
              textColor="#111827"
              left={<TextInput.Icon icon={() => <Mail size={20} color="#6b7280" />} />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!emailError}
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              label="Senha"
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                setSenhaError("");
              }}
              mode="outlined"
              style={styles.input}
              outlineColor="#e5e7eb"
              activeOutlineColor="rgba(51, 26, 192, 1)"
              textColor="#111827"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon={() => <Lock size={20} color="#6b7280" />} />}
              right={
                <TextInput.Icon
                  icon={() =>
                    showPassword ? (
                      <EyeOff size={20} color="#6b7280" />
                    ) : (
                      <Eye size={20} color="#6b7280" />
                    )
                  }
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              error={!!senhaError}
            />
            {senhaError ? (
              <HelperText type="error" visible={!!senhaError}>
                {senhaError}
              </HelperText>
            ) : null}
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            buttonColor="rgba(51, 26, 192, 1)"
            contentStyle={styles.buttonContent}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>F</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>A</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#f3e8ff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "rgba(51, 26, 192, 1)",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    borderRadius: 12,
    elevation: 0,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#6b7280",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  footerLink: {
    fontSize: 14,
    color: "rgba(51, 26, 192, 1)",
    fontWeight: "600",
  },
});