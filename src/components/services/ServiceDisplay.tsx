import { ServiceCard } from "./ServiceCard";
import type { Service } from "../../types/service";
import { getServiceState } from "../../utils/serviceUtils";
import { View } from "react-native";

type ServiceDisplayProps = {
  services: Service[];
  selectedServices: Service[];
  onPress: (service: Service) => void;
};

export function ServiceDisplay({ services, selectedServices, onPress }: ServiceDisplayProps) {
  return (
    <View style={{ gap: 12 }}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          state={getServiceState(service, selectedServices)}
          onPress={() => onPress(service)}
        />
      ))}
    </View>
  );
}