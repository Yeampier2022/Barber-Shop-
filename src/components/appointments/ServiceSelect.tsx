import { Pressable, ScrollView, Text, View } from "react-native";
import type {
  Service,
  ServiceState,
} from "../../types/service";
import { getServiceState } from "../../utils/serviceUtils";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

type ServiceSelectProps = {
  services: Service[];
  selectedService: Service | null;
  onSelectService: (service: Service | null) => void;
};

type ServiceSelectStyle = {
  containerClassName: string;
  titleColor: string;
  detailColor: string;
};

const SERVICE_SELECT_STYLES: Record<
  ServiceState,
  ServiceSelectStyle
> = {
  default: {
    containerClassName:
      "w-40 rounded-xl border border-brand-border bg-white p-3",
    titleColor: colors.primary,
    detailColor: colors.tertiary,
  },

  selected: {
    containerClassName:
      "w-40 rounded-xl border border-brand-primary bg-brand-primary p-3",
    titleColor: colors.cream,
    detailColor: colors.cream,
  },
};

export function ServiceSelect({
  services,
  selectedService,
  onSelectService,
}: ServiceSelectProps) {
  return (
    <View>
      <Text
        className="mb-3"
        style={{
          color: colors.primary,
          fontFamily: fonts.bold,
          fontSize: 16,
        }}
      >
        Service
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          paddingRight: 16,
        }}
      >
        {services.map((service) => {
          const state = getServiceState(
            service,
            selectedService
          );
          const style = SERVICE_SELECT_STYLES[state];

          return (
            <Pressable
              key={service.id}
              accessibilityRole="button"
              accessibilityState={{
                selected: state === "selected",
              }}
              className={style.containerClassName}
              onPress={() =>
                onSelectService(
                  selectedService?.id === service.id
                    ? null
                    : service
                )
              }
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: style.titleColor,
                  fontFamily: fonts.bold,
                  fontSize: 14,
                }}
              >
                {service.name}
              </Text>

              <View className="mt-3 flex-row justify-between">
                <Text
                  style={{
                    color: style.detailColor,
                    fontFamily: fonts.regular,
                    fontSize: 12,
                  }}
                >
                  {service.duration} min
                </Text>

                <Text
                  style={{
                    color: style.detailColor,
                    fontFamily: fonts.bold,
                    fontSize: 12,
                  }}
                >
                  ${service.price}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}