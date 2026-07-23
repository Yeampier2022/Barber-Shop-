import { TimeSlotButton } from "./TimeSlotButton";
import { View } from "react-native";
import { getTimeSlots, getSlotState } from "../../../utils/scheduleUtils";
import type { TimeSlot } from "../../../types/schedule";

type ScheduleDisplayProps = {
  day: Date;
  startHour: number;
  endHour: number;
  slotLength: number;
  selectedStartTime: Date | null;
  onSlotPress: (slot: TimeSlot) => void;
};

export function ScheduleDisplay({
  day,
  startHour,
  endHour,
  slotLength,
  selectedStartTime,
  onSlotPress,
}: ScheduleDisplayProps) {
  
  const slots = getTimeSlots(
    day,
    startHour,
    endHour,
    slotLength
  );

  // TODO: Apply barber availability
  // Check for currently booked slots
  // slots = slots.filter((slot) => slot.isBookable);

  return (
    <View className="flex-row flex-wrap pt-2">
      {slots.map((slot) => (
        <TimeSlotButton
          key={slot.start.toISOString()}
          slot={slot}
          state={getSlotState(slot, selectedStartTime)}
          onPress={() => onSlotPress(slot)}
        />
      ))}
    </View>
  )
}