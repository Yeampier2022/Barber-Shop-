import type { Service } from "../../types/service";
import { Button } from "../Button";
import { View, Text } from "react-native";

type ServiceCardProps = {
  service: Service;
  selected: boolean;
  onPress: () => void;
};

export function ServiceCard({
  service,
  selected,
  onPress
}: ServiceCardProps) {
  return (
    <Button
      variant={selected ? "solid" : "soft"}
      color="primary"
      size="sm"
      fullWidth
      onPress={onPress}
    >
      <View className="flex-1 items-center justify-between">
        <Text>{service.name}</Text>
        <Text>{service.description}</Text>
      </View>
      <View className="items-end">
        <Text>${service.price}</Text>
        <Text>{service.duration} min</Text>
      </View>
    </Button>
  );
}