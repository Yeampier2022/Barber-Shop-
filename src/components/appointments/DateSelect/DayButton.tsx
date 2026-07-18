import { Button } from "../../Button";
import { View, Text } from "react-native";
import {
  formatDay,
  formatWeekday,
} from "../../../utils/dateUtils";

type DayButtonProps = {
  date: Date;
  selected?: boolean;
  today?: boolean;
  disabled?: boolean;
  onPress: (date: Date) => void;
};

export function DayButton({
  date,
  selected,
  today,
  disabled,
  onPress,
}: DayButtonProps) {
  return (
    <Button
      variant={selected ? "solid" : "soft"}
      color="primary"
      size="sm"
      disabled={disabled}
      className="flex-1 mx-1 rounded-xl py-2"
      onPress={() => onPress(date)}
    >
      <View className="items-center">
        <Text
          className={
            selected
              ? "text-white text-xs"
              : "text-brand-primary text-xs"
          }
        >
          {formatWeekday(date)}
        </Text>
        <Text
          className={
            selected
              ? "text-white text-lg"
              : "text-brand-primary text-lg"
          }
        >
          {formatDay(date)}
        </Text>
        <View className="h-2 justify-center">
          {today && (
            <View className="h-2 w-2 rounded-full bg-brand-primary" />
          )}
        </View>
      </View>
    </Button>
  );
}