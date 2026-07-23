import { TimeSlotButton } from "./TimeSlotButton";
import { View } from "react-native";
import { getTimeSlots, getSlotState, applyAppointments, applyPastAvailable } from "../../../utils/scheduleUtils";
import type { TimeSlot, Appointment } from "../../../types/schedule";

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

  const openSlots = applyAppointments(allSlots, appointments || []);

  const availableSlots = applyPastAvailable(openSlots);
  // TODO: Apply barber availability

  return (
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
  )
}