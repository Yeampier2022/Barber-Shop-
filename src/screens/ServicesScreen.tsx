import { View, ScrollView } from "react-native";
import { ServiceDisplay } from "../components/services/ServiceDisplay";
import { mockServices } from "../mocks/services";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { AppView } from "../navigation/AppNavigator";
import { Service } from "../types/service";

export interface ServicesScreenProps {
  userInitials?: string;
  onAvatarPress?: () => void;
  selectedService: Service | null;
  onSelectService: (service: Service | null) => void;
  onNavigate: (screen: AppView) => void;
}

export function ServicesScreen({
  userInitials = "?",
  onAvatarPress,
  selectedService,
  onSelectService,
  onNavigate
}: ServicesScreenProps) {
  return (
    <View className="flex-1">
      <Header
        isAuthenticated
        userInitials={userInitials}
        onAvatarPress={onAvatarPress}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 24,
          paddingBottom: 16
         }}
      >
        <View className="flex-1 px-6 pt-6" style={{ gap: 16 }}>
          <ServiceDisplay
            services={mockServices}
            selectedService={selectedService}
            onPress={(service) =>
              onSelectService(
                selectedService?.id === service.id ? null : service
              )
            }
          />
        </View>
      </ScrollView>

      <BottomNav
        active="Services"
        onChange={(tab) => onNavigate(tab.toLowerCase() as AppView)}
      />
    </View>
  );
}
