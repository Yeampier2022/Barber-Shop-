import { TimeSlotButton } from "./TimeSlotButton";
import { View, Text } from "react-native";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { getTimeSlots, getSlotState, applyAppointments, applyPastAvailable } from "../../../utils/scheduleUtils";
import type { TimeSlot, Appointment } from "../../../types/schedule";
import { formatFullDate } from "../../../utils/dateUtils";

type ScheduleDisplayProps = {
  day: Date;
  startHour: number;
  endHour: number;
  slotLength: number;
  appointments: Appointment[];
  selectedStartTime: Date | null;
  onSlotPress: (slot: TimeSlot) => void;
};

export function ScheduleDisplay({
  day,
  startHour,
  endHour,
  slotLength,
  appointments,
  selectedStartTime,
  onSlotPress,
}: ScheduleDisplayProps) {
  
  const allSlots = getTimeSlots(
    day,
    startHour,
    endHour,
    slotLength
  );

  const openSlots = applyAppointments(
    allSlots,
    appointments || []
  );

  const availableSlots = applyPastAvailable(openSlots);
  // TODO: Apply barber availability

  return (
    <View>
      <View className="mx-4 mt-4 mb-2 flex-col items-center">
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 16,
            color: colors.primary,
          }}
        >
          Available Times
        </Text>

        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 12,
            color: colors.tertiary,
          }}
        >
          {formatFullDate(day)}
        </Text>
      </View>
      <View className="flex-row flex-wrap pt-2">
        {availableSlots.map((slot) => (
          <TimeSlotButton
            key={slot.start.toISOString()}
            slot={slot}
            state={getSlotState(slot, selectedStartTime)}
            onPress={() => onSlotPress(slot)}
          />
        ))}
      </View>
    </View>
  )
}