import { set, addMinutes, isEqual, format } from "date-fns";
import { TimeSlot, SlotState } from "../types/schedule";

export function getTimeSlots(
  day: Date,
  startHour: number,
  endHour: number,
  slotLength: number,
): TimeSlot[] {
  
  const start = set(day, { // Set start of day, clear minutes and seconds
    hours: startHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const end = set(day, { // Set end of day, clear minutes and seconds
    hours: endHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const slots: TimeSlot[] = [];

  let current = start;

  while (current < end) {
    const slotEnd = addMinutes(current, slotLength);
    if (slotEnd > end) {
      break;
    }
    slots.push({
      start: current,
      end: slotEnd,
      isBookable: true
    });
    current = slotEnd;
  }
  return slots;
}

export function isSelectedSlot(
  slot: TimeSlot,
  selectedStart: Date | null
) {
  return selectedStart !== null &&
    isEqual(slot.start, selectedStart);
}

export function getSlotState(
  slot: TimeSlot,
  selectedStart: Date | null,
): SlotState {
  if (isSelectedSlot(slot, selectedStart)) {
    return "selected";
  }
  
  return "available";
}

export function formatTime(time: Date) {
  return format(time, "h:mm a");
}

export function filterSlots() {

}