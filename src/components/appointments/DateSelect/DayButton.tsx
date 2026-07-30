import {
  Button,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "../../Button";
import { View, Text } from "react-native";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { formatDay, formatWeekday } from "../../../utils/dateUtils";
import type { DayState } from "../../../types/calendar";

type DayButtonProps = {
  date: Date;
  state: DayState;
  showWeekday?: boolean;
  onPress: () => void;
};

const DAY_STYLES: Record<DayState, {
    variant: ButtonVariant;
    color: ButtonColor;
    textColor: string;
    showTodayDot: boolean;
    disabled: boolean;
  }> = {
    default: {
      variant: "soft",
      color: "tertiary",
      textColor: colors.primary,
      showTodayDot: false,
      disabled: false,
    },
    disabled: {
      variant: "soft",
      color: "primary",
      textColor: colors.tertiary,
      showTodayDot: false,
      disabled: true,
    },
    muted: {
      variant: "soft",
      color: "primary",
      textColor: colors.tertiary,
      showTodayDot: false,
      disabled: true,
    },
    today: {
      variant: "soft",
      color: "tertiary",
      textColor: colors.primary,
      showTodayDot: true,
      disabled: false,
    }, 
    selected: {
      variant: "solid",
      color: "primary",
      textColor: colors.cream,
      showTodayDot: false,
      disabled: false,
    },
  };
  
  
export function DayButton({
    date,
    state = "default",
    showWeekday = true,
    onPress,
}: DayButtonProps) {

  const style = DAY_STYLES[state];

  return (
    <Button
      variant={style.variant}
      color={style.color}
      size="sm"
      disabled={style.disabled}
      className="flex-1 mx-1 rounded-xl py-2"
      onPress={onPress}
    >
      <View className="items-center">
        {showWeekday && (
          <Text
          style={{
            color: style.textColor,
            fontFamily: fonts.medium,
            fontSize: 10,
          }}
          >
            {formatWeekday(date)}
          </Text>
        )}
        <Text
          style={{
            color: style.textColor,
            fontFamily: fonts.bold,
            fontSize: 16,
          }}
        >
          {formatDay(date)}
        </Text>
        <View className="h-2 justify-center">
          {style.showTodayDot && (
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