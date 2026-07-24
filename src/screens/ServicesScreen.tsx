import { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { ServiceDisplay} from "../components/services/ServiceDisplay";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import { Service } from "../types/service";

export interface ServicesScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
  onNavigate: (screen: AppView) => void
}

export function ServicesScreen({
  userInitials = "?",
  onAvatarPress,
  onNavigate
}: ServicesScreenProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  useEffect(() => {
    setSelectedServices([]);
  }, []);

  return (
    <View>
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView className="flex-1 px-6 pt-6" style={{ gap: 16 }}>
        <ServiceDisplay
          services={[]}
          selectedServices={selectedServices}
          onPress={(service) => {}}
        />
      </ScrollView>

      <BottomNav
        active="Services"
        onChange={(tab) => onNavigate(tab.toLowerCase() as AppView)}
      />
    </View>
  );
}