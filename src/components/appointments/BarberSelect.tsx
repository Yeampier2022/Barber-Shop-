import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import type {
  Barber,
  BarberState,
} from "../../types/barber";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";

type BarberSelectProps = {
  barbers: Barber[];
  selectedBarber: Barber | null;
  onSelectBarber: (barber: Barber | null) => void;
};

type BarberSelectStyle = {
  containerClassName: string;
  nameColor: string;
};

const BARBER_SELECT_STYLES: Record<
  BarberState,
  BarberSelectStyle
> = {
  default: {
    containerClassName:
      "w-28 items-center rounded-xl border border-brand-border bg-white p-3",
    nameColor: colors.primary,
  },
  selected: {
    containerClassName:
      "w-28 items-center rounded-xl border border-brand-primary bg-brand-primary p-3",
    nameColor: colors.cream,
  },
};

export function BarberSelect({
  barbers,
  selectedBarber,
  onSelectBarber,
}: BarberSelectProps) {
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
        Barber
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          paddingRight: 16,
        }}
      >
        {barbers.map((barber) => {
          const state: BarberState =
            selectedBarber?.id === barber.id
              ? "selected"
              : "default";
          const style = BARBER_SELECT_STYLES[state];

          return (
            <Pressable
              key={barber.id}
              accessibilityRole="button"
              accessibilityState={{
                selected: state === "selected",
              }}
              className={style.containerClassName}
              onPress={() =>
                onSelectBarber(
                  selectedBarber?.id === barber.id
                    ? null
                    : barber
                )
              }
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Image
                source={barber.image}
                className="h-16 w-16 rounded-full bg-brand-neutral"
                resizeMode="cover"
              />
              <Text
                className="mt-2 text-center"
                numberOfLines={1}
                style={{
                  color: style.nameColor,
                  fontFamily: fonts.bold,
                  fontSize: 13,
                }}
              >
                {barber.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
