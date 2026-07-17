import { ScrollView, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";

export interface HomeScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
}

export function HomeScreen({ userInitials = "YJ", onAvatarPress }: HomeScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView className="flex-1 px-6 pt-6" style={{ gap: 16 }}>
        <Text className="font-roboto-slab-bold text-2xl text-brand-primary">
          Welcome back
        </Text>
        <Text className="mt-1 font-roboto-slab text-base text-brand-tertiary">
          Your upcoming appointments will show up here.
        </Text>

        <View className="mt-6 rounded-2xl bg-brand-neutral p-4">
          <Text className="font-roboto-slab-bold text-brand-primary">
            No upcoming appointments
          </Text>
          <Text className="mt-1 font-roboto-slab text-sm text-brand-tertiary">
            Book your next haircut from the Services tab.
          </Text>
        </View>
      </ScrollView>

      <BottomNav active="Home" />
    </View>
  );
}
