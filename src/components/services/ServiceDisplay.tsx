import { ServiceCard } from "./ServiceCard";
import type { Service } from "../../types/service";
import { View } from "react-native";

type ServiceDisplayProps = {
  services: Service[];
  selectedServices: Service[];
  onPress: (service: Service) => void;
};

export function ServiceDisplay({ services, selectedServices, onPress }: ServiceDisplayProps) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          selected={selectedServices.some((selectedService) => selectedService.id === service.id)}
          onPress={() => onPress(service)}
        />
      ))}
    </View>
  );
}