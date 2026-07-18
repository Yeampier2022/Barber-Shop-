import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { getAuthErrorMessage, registerWithEmail } from "../services/authService";
import { createUserProfile } from "../services/firestoreService";
import type { UserRole } from "../types/user";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhone,
} from "../utils/validators";

export interface RegisterScreenProps {
  onSubmit?: () => void;
  onLogin?: () => void;
}

type FormErrors = Partial<
  Record<"name" | "phone" | "email" | "password" | "confirmPassword", string>
>;

export function RegisterScreen({ onSubmit, onLogin }: RegisterScreenProps) {
  const [role, setRole] = useState<UserRole>("client");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!isValidName(name)) {
      nextErrors.name = "Enter your full name.";
    }
    if (!isValidPhone(phone)) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email.";
    }
    if (!isValidPassword(password)) {
      nextErrors.password = "Minimum 6 characters.";
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords don't match.";
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
      const user = await registerWithEmail(email, password, name);
      await createUserProfile(user.uid, { name, phone, email, role });
      console.log("[Register] Registration complete, uid:", user.uid);
      Alert.alert("Account created", "Your account was created successfully.", [
        { text: "OK", onPress: () => onSubmit?.() },
      ]);
    } catch (error) {
      console.error("[Register] Registration failed:", error);
      setFormError(getAuthErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header />

      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="font-roboto-slab-bold text-2xl text-brand-primary">
          Create account
        </Text>

        <View className="mt-6" style={{ gap: 8 }}>
          <Text className="font-roboto-slab-bold text-sm text-brand-primary">
            I am a
          </Text>
          <View className="flex-row" style={{ gap: 8 }}>
            <Button
              size="md"
              variant={role === "client" ? "solid" : "soft"}
              onPress={() => setRole("client")}
              className="flex-1"
            >
              Client
            </Button>
            <Button
              size="md"
              variant={role === "barber" ? "solid" : "soft"}
              onPress={() => setRole("barber")}
              className="flex-1"
            >
              Barber
            </Button>
          </View>
        </View>

        <View className="mt-6" style={{ gap: 16 }}>
          <Input
            label="Name"
            placeholder="Full name"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />
          <Input
            label="phone"
            placeholder="Phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
          />
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
          <Input
            label="Confirm password"
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
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
          onPress={handleSubmit}
        >
          Sign up
        </Button>

        <Pressable className="mt-4 items-center" onPress={onLogin}>
          <Text className="font-roboto-slab text-sm text-brand-tertiary">
            Already have an account?{" "}
            <Text className="font-roboto-slab-bold text-brand-primary">
              Log in
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
