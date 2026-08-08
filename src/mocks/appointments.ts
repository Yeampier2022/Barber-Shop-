import { addDays, set } from "date-fns";
import type { Appointment } from "../types/schedule";

export function getMockAppointments(day: Date): Appointment[] {
  const tomorrow = addDays(day, 1);
  const twoDaysFromNow = addDays(day, 2);
  const threeDaysFromNow = addDays(day, 3);

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
      barberId: "barber-2",
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
    {
      barberId: "barber-2",
      clientId: "client-4",
      start: set(tomorrow, {
        hours: 10,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(tomorrow, {
        hours: 10,
        minutes: 30,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      barberId: "barber-1",
      clientId: "client-5",
      start: set(tomorrow, {
        hours: 14,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(tomorrow, {
        hours: 15,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      barberId: "barber-1",
      clientId: "client-6",
      start: set(twoDaysFromNow, {
        hours: 9,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(twoDaysFromNow, {
        hours: 10,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      barberId: "barber-2",
      clientId: "client-7",
      start: set(twoDaysFromNow, {
        hours: 15,
        minutes: 30,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(twoDaysFromNow, {
        hours: 16,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      }),
    },
    {
      barberId: "barber-2",
      clientId: "client-8",
      start: set(threeDaysFromNow, {
        hours: 11,
        minutes: 30,
        seconds: 0,
        milliseconds: 0,
      }),
      end: set(threeDaysFromNow, {
        hours: 12,
        minutes: 30,
        seconds: 0,
        milliseconds: 0,
      }),
    },
  ];
}
