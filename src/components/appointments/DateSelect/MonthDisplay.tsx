import { DayButton } from "./DayButton";
import { View } from "react-native";
import { getMonthGrid, getDayState } from "../../../utils/dateUtils";
import type { CalendarDay } from "../../../types/calendar";

type MonthDisplayProps = {
  month: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export function MonthDisplay({
  month,
  selectedDate,
  onSelectDate
}: MonthDisplayProps) {

  const days: CalendarDay[] = getMonthGrid(month);
  const weeks: CalendarDay[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <View>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row justify-between py-0.5">
          {week.map((day) => (
            <DayButton
              key={day.date.toISOString()}
              date={day.date}
              state={getDayState(day, selectedDate)}
              showWeekday={false}
              onPress={() => onSelectDate(day.date)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}