import { View, Text } from "react-native";
import { DayButton } from "./DayButton";

import {
  getNextDays,
  isSameDay,
  createCalendarDays,
  type CalendarDay,
  type DayState,
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

  const days = createCalendarDays(
    getNextDays(7, weekStart)
  );

  return (
    <View className="flex-row justify-between">
      {days.map((day) => (
        <DayButton
          key={day.date.toISOString()}
          date={day.date}
          state={isSameDay(day.date, selectedDate) ? "selected" : "default"}
          showWeekday={true}
          onPress={() => onSelectDate(day.date)}
        />
      ))}
    </View>
  );
}