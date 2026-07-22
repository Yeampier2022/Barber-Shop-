import { View, Text, Pressable } from 'react-native';
import { Button } from '../../Button';
import { formatMonth, weekdayLabels } from '../../../utils/dateUtils';
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
  onNextMonth,
  previousDisabled,
  nextDisabled
}: MonthHeaderProps) {

  const monthLabel = formatMonth(month);
  const weekdays = weekdayLabels();

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Button
          size="sm"
          variant="soft"
          color="primary"
          disabled={previousDisabled}
          onPress={onPreviousMonth}
        >
          &lt;
        </Button>
        <Text>{monthLabel}</Text>
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
      <View className="flex-row">
        {weekdays.map((weekday) => (
          <Text key={weekday} className="flex-1 text-center">
            {weekday}
          </Text>
        ))}
      </View>
    </View>
  );
}