import { View, Text, Pressable } from 'react-native';
import { Button } from '../../Button';
import {
  formatMonth,
  weekdayLabels,
  getCurrentBookingMonth,
  getLastBookableMonth,
  isSameMonth
} from '../../../utils/dateUtils';
import { colors } from '../../../theme/colors';
import { fonts } from '../../../theme/fonts';

type MonthHeaderProps = {
  month: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
};

export function MonthHeader({
  month,
  onPreviousMonth,
  onNextMonth
}: MonthHeaderProps) {

  const monthLabel = formatMonth(month);
  const weekdays = weekdayLabels();
  const currentMonth = getCurrentBookingMonth();
  const lastBookableMonth = getLastBookableMonth();

  const previousDisabled = isSameMonth(month, currentMonth);
  const nextDisabled = isSameMonth(month, lastBookableMonth);

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-between mb-2">
        <Button
          size="sm"
          variant="soft"
          color="primary"
          disabled={previousDisabled}
          onPress={onPreviousMonth}
        >
          &lt;
        </Button>
        <Text style={{
          fontFamily: fonts.bold,
          fontSize: 16,
          color: colors.primary
        }}
        >
          {monthLabel}
        </Text>
        <Button
          size="sm"
          variant="soft"          
          color="primary"
          disabled={nextDisabled}
          onPress={onNextMonth}
        >
          &gt;
        </Button>
      </View>
      <View className="flex-row px-1">
        {weekdays.map((weekday) => (
          <Text
            key={weekday}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: fonts.medium,
              fontSize: 12,
              color: colors.primary,
            }}
          >
            {weekday}
          </Text>
        ))}
      </View>
    </View>
  );
}