import { View, Text } from "react-native";
import { DayButton } from "./DayButton";

import {
  getNextDays,
  isSameDay,
  isToday,
} from "../../../utils/dateUtils";

type WeekStripProps = {
  selectedDate: Date;
  weekStart: Date;
  onSelectDate: (date: Date) => void;
};

export function WeekStrip({
  selectedDate,
  weekStart,
  onSelectDate,
}: WeekStripProps) {

  const dates = getNextDays(7, weekStart);

  return (
    <View className="flex-row justify-between">
      {dates.map((date) => (
        <DayButton
          key={date.toISOString()}
          date={date}
          selected={isSameDay(date, selectedDate)}
          today={isToday(date)}
          onPress={onSelectDate}
        />
      ))}
    </View>
  );
}