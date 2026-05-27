import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister() {
    setSubmitting(true);
    const result = await signUp(email, password, displayName);
    setFeedback(result.message);
    setSubmitting(false);

    if (result.success) {
      router.replace("/");
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Inscription</Text>
        <Text style={styles.subtitle}>Créez un compte pour participer aux enchères.</Text>

        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Nom affiché"
          style={styles.input}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe"
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          disabled={submitting}
          onPress={handleRegister}
          style={({ pressed }) => [
            styles.button,
            submitting && styles.disabledButton,
            pressed && !submitting && styles.pressedButton,
          ]}
        >
          <Text style={styles.buttonText}>{submitting ? "Création..." : "Créer le compte"}</Text>
        </Pressable>

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        <Link href="/login" style={styles.link}>
          Se connecter avec un compte existant
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7f9",
    justifyContent: "center",
    padding: 24,
  },
  form: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: "#5f6c7b",
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#0f766e",
    paddingVertical: 13,
  },
  pressedButton: {
    opacity: 0.85,
  },
  disabledButton: {
    backgroundColor: "#8a8f98",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  feedback: {
    marginTop: 12,
    color: "#374151",
  },
  link: {
    marginTop: 18,
    color: "#0f766e",
    fontWeight: "700",
  },
});
