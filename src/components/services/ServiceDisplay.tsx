import { ServiceCard } from "./ServiceCard";
import type { Service } from "../../types/service";
import { getServiceState } from "../../utils/serviceUtils";
import { View } from "react-native";

type ServiceDisplayProps = {
  services: Service[];
  selectedService: Service | null;
  onPress: (service: Service) => void;
};

export function ServiceDisplay({
  services,
  selectedService,
  onPress
}: ServiceDisplayProps) {
  return (
    <View style={{ gap: 12 }}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          state={getServiceState(service, selectedService)}
          onPress={() => onPress(service)}
        />
      ))}
    </View>
  );
}