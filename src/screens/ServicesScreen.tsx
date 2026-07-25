import { View, ScrollView, Text } from "react-native";
import { ServiceDisplay } from "../components/services/ServiceDisplay";
import { mockServices } from "../mocks/services";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { fonts } from "../theme/fonts";
import { colors } from "../theme/colors";
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
        <Text
          className="px-4"
          style={{
          fontFamily: fonts.bold,
          fontSize: 24,
          color: colors.primary
        }}>
          Services
        </Text>
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
      
      <Button
        variant="solid"
        size="md"
        className=" mx-6 my-3"
        disabled={!selectedService}
        onPress={() => onNavigate("appointments")}
      >
        Check Availability 
      </Button>
      <BottomNav
        active="Services"
        onChange={(tab) => onNavigate(tab.toLowerCase() as AppView)}
      />
    </View>
  );
}
