import { View, Text, Pressable } from "react-native";
import type { Service, ServiceState } from "../../types/service";
import { fonts } from "../../theme/fonts";
import { colors } from "../../theme/colors";

type ServiceCardProps = {
  service: Service;
  state: ServiceState;
  onPress: () => void;
};

const SERVICE_STYLES: Record<ServiceState,
  {
    containerClassName: string;
    titleColor: string;
    descirptionColor: string;
    detailColor: string;
   }> = {
  default: {
    containerClassName: "min-h-[120px] w-full rounded-xl border-2 border-brand-border bg-white p-4",
    titleColor: colors.primary,
    descirptionColor: colors.secondary,
    detailColor: colors.tertiary
  },
  selected: {
    containerClassName: "min-h-[120px] w-full rounded-xl border-2 border-brand-primary bg-brand-primary p-4",
    titleColor: colors.cream,
    descirptionColor: colors.cream,
    detailColor: colors.cream
  }
}

export function ServiceCard({
  service,
  state,
  onPress
}: ServiceCardProps) {

  const styles = SERVICE_STYLES[state];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: state === "selected" }}
      onPress={onPress}
      className={styles.containerClassName}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1
      })}
    >
      <View className="flex-1 items-center justify-between">
        <Text style={{
          color: styles.titleColor,
          fontFamily: fonts.bold,
          fontSize: 16
        }}>
          {service.name}
        </Text>
        <Text style={{
          color: styles.descirptionColor,
          fontFamily: fonts.regular,
          fontSize: 12
        }}>
          {service.description}
        </Text>
      </View>
      <View className="items-end">
        <Text
          style={{
            color: styles.detailColor,
            fontFamily: fonts.regular,
            fontSize: 12
          }}>
          {service.duration} min
        </Text>
        <Text
          style={{
            color: styles.detailColor,
            fontFamily: fonts.bold,
            fontSize: 16
          }}>${service.price}
        </Text>
      </View>
    </Pressable>
  );
}