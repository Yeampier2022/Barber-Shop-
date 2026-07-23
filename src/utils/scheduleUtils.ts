import { set, addMinutes, isEqual, format } from "date-fns";
import type { TimeSlot, SlotState, Appointment } from "../types/schedule";

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

export function isPastSlot(slot: TimeSlot) {
  return slot.start < new Date();
}

export function getSlotState(
  slot: TimeSlot,
  selectedStart: Date | null,
): SlotState {
  if (!slot.isBookable) {
    return "unavailable";
  } 
  if (isSelectedSlot(slot, selectedStart)) {
    return "selected";
  }
  
  return "available";
}

export function formatTime(time: Date) {
  return format(time, "h:mm a");
}

export function doesOverlap(
  slot: TimeSlot,
  appointment: Appointment) {
  return (
    slot.start < appointment.end &&
    slot.end > appointment.start
  );
}

export function applyAppointments(
  slots: TimeSlot[],
  appointments: Appointment[]
): TimeSlot[] {
  return slots.map(slot => {
    const unavailable = appointments.some(
      appointment => doesOverlap(slot, appointment)
    );
    return {
      ...slot,
      isBookable: !unavailable
    };
  })
}

export function applyPastAvailable(
  slots: TimeSlot[]
): TimeSlot[] {
  return slots.map(slot => {
    return {
      ...slot,
      isBookable: slot.isBookable && !isPastSlot(slot),
    };
  })
}
