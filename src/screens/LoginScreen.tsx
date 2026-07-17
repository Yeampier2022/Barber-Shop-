import { Pressable, ScrollView, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";

export interface LoginScreenProps {
  onSubmit?: () => void;
  onRegister?: () => void;
}

export function LoginScreen({ onSubmit, onRegister }: LoginScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="font-roboto-slab-bold text-2xl text-brand-primary">
          Log in
        </Text>

        <View className="mt-6" style={{ gap: 16 }}>
          <Input label="Email" placeholder="you@example.com" keyboardType="email-address" />
          <Input label="Password" placeholder="Password" secureTextEntry />
        </View>

        <Button size="lg" fullWidth className="mt-8" onPress={onSubmit}>
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
