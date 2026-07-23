import { set } from "date-fns";
import type { Appointment } from "../types/schedule";

export function getMockAppointments(day: Date): Appointment[] {
  return [
    {
      barberId: "barber-1",
      clientId: "client-1",
      start: set(day, {
        hours: 9,
        minutes: 30,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(day, {
        hours: 10,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      barberId: "barber-1",
      clientId: "client-2",
      start: set(day, {
        hours: 11,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(day, {
        hours: 12,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      barberId: "barber-1",
      clientId: "client-3",
      start: set(day, {
        hours: 13,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(day, {
        hours: 13,
        minutes: 45,
        seconds: 0,
        milliseconds: 0,
      }),
    },
  ];
}