import { addMinutes } from "date-fns";
import { Appointment } from "../types/schedule";

export function getMockAppointments(day: Date): Appointment[] {
  return [
    {
      barberId: "barber1",
      clientId: "client1",
      start: day,
      end: addMinutes(day, 30),
    },
    {
      barberId: "barber2",
      clientId: "client2",
      start: day,
      end: addMinutes(day, 30),
    },
  ];
}