import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { getAuthErrorMessage, signInWithEmail } from "../services/authService";
import { isValidEmail, isValidPassword } from "../utils/validators";

export interface LoginScreenProps {
  onSubmit?: () => void;
  onRegister?: () => void;
}

type FormErrors = Partial<Record<"email" | "password", string>>;

export function LoginScreen({ onSubmit, onRegister }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email.";
    }
    if (!isValidPassword(password)) {
      nextErrors.password = "Minimum 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    setFormError(null);
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const user = await signInWithEmail(email, password);
      console.log("[Login] Signed in, uid:", user.uid);
      onSubmit?.();
    } catch (error) {
      console.error("[Login] Login failed:", error);
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="font-roboto-slab-bold text-2xl text-brand-primary">
          Log in
        </Text>

        <View className="mt-6" style={{ gap: 16 }}>
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />
        </View>

        {formError ? (
          <Text className="mt-4 text-center text-sm text-red-500">{formError}</Text>
        ) : null}

        <Button
          size="lg"
          fullWidth
          className="mt-8"
          loading={submitting}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          Log in
        </Button>

        <Pressable className="mt-4 items-center" onPress={onRegister}>
          <Text className="font-roboto-slab text-sm text-brand-tertiary">
            Don't have an account?{" "}
            <Text className="font-roboto-slab-bold text-brand-primary">
              Sign up
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
