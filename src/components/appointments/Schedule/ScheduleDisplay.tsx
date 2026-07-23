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
  
}