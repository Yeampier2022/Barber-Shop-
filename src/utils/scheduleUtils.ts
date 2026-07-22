import { set, addMinutes } from "date-fns";
import { TimeSlot } from "../types/schedule";

export function getTimeSlots(
  day: Date,
  startHour: number,
  endHour: number,
  slotLength: number
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