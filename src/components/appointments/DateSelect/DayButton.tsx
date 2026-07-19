import { Button } from "../../Button";
import { View, Text } from "react-native";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import {
  formatDay,
  formatWeekday,
} from "../../../utils/dateUtils";

type DayButtonProps = {
  date: Date;
  selected?: boolean;
  today?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function DayButton({
    date,
    selected = false,
    today = false,
    disabled = false,
    onPress,
}: DayButtonProps) {

    const buttonVariant = selected
        ? "solid"
        : "soft";

    const textColor = selected
        ? colors.cream
        : colors.primary;

    const buttonClass = disabled
        ? "opacity-50"
        : "flex-1 mx-1 rounded-xl py-2";
  return (
    <Button
      variant={selected ? "solid" : "soft"}
      color="primary"
      size="sm"
      disabled={disabled}
      className="flex-1 mx-1 rounded-xl py-2"
      onPress={onPress}
    >
      <View className="items-center">
        <Text
          style={{
            color: textColor,
            fontFamily: fonts.medium,
            fontSize: 10,
          }}
        >
          {formatWeekday(date)}
        </Text>
        <Text
          style={{
            color: textColor,
            fontFamily: fonts.bold,
            fontSize: 16,
          }}
        >
          {formatDay(date)}
        </Text>
        <View className="h-2 justify-center">
          {today && (
            <View
              style={{
                backgroundColor: colors.secondary, 
              }}
              className="h-1 w-1 rounded-full"
             />
          )}
        </View>
      </View>
    </Button>
  );
}