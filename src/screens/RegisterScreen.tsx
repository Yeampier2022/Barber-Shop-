import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export interface RegisterScreenProps {
  onSubmit?: () => void;
  onLogin?: () => void;
}

type Role = "client" | "barber";

export function RegisterScreen({ onSubmit, onLogin }: RegisterScreenProps) {
  const [role, setRole] = useState<Role>("client");

  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
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
          <Input label="Name" placeholder="Full name" />
          <Input label="Email" placeholder="you@example.com" keyboardType="email-address" />
          <Input label="Password" placeholder="Password" secureTextEntry />
          <Input label="Confirm password" placeholder="Confirm password" secureTextEntry />
        </View>

        <Button size="lg" fullWidth className="mt-8" onPress={onSubmit}>
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
    </View>
  );
}
