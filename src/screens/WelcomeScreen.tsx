import { Image, ScrollView, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Header } from "../components/Header";

export interface WelcomeScreenProps {
  onLogin?: () => void;
  onRegister?: () => void;
  onGoogleLogin?: () => void;
}

export function WelcomeScreen({
  onLogin,
  onRegister,
  onGoogleLogin,
}: WelcomeScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={require("../../assets/pexels-elchinoportrait-19482851.jpg")}
          className="h-64 w-full"
          resizeMode="cover"
        />

        <View className="flex-1 px-6 pt-8" style={{ gap: 24 }}>
          <View style={{ gap: 8 }}>
            <Text className="font-roboto-slab-bold text-3xl text-brand-primary">
              Welcome to CorteListo
            </Text>
            <Text className="font-roboto-slab text-base text-brand-tertiary">
              Book your haircut with the best barbers, no lines, no hassle.
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <Button size="lg" fullWidth onPress={onLogin}>
              Log in
            </Button>
            <Button size="lg" variant="soft" fullWidth onPress={onRegister}>
              Sign up
            </Button>

            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className="h-px flex-1 bg-brand-border" />
              <Text className="font-roboto-slab text-xs text-brand-tertiary">
                or
              </Text>
              <View className="h-px flex-1 bg-brand-border" />
            </View>

            <Button
              size="lg"
              variant="outline"
              fullWidth
              onPress={onGoogleLogin}
            >
              Continue with Google
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
