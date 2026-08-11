import { addDays, set } from "date-fns";
import type { Barber } from "../types/barber";
import type { Service } from "../types/service";
import { mockBarbers } from "./barbers";
import { mockServices } from "./services";

export type Reservation = {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  barber: Barber;
  service: Service;
  start: Date;
  end: Date;
};

const [alex, jordan] = mockBarbers;
const [classicHaircut, beardTrim, haircutAndBeard] = mockServices;

// TODO: replace with a Firestore query (reservations collection, filtered by
// clientId or barberId and ordered by start time) once bookings are persisted.
export function getMockReservations(referenceDay: Date): Reservation[] {
  const tomorrow = addDays(referenceDay, 1);
  const twoDaysFromNow = addDays(referenceDay, 2);
  const threeDaysFromNow = addDays(referenceDay, 3);

  const reservations: Reservation[] = [
    {
      id: "res-1",
      clientId: "client-1",
      clientName: "Carlos Pérez",
      phone: "+1 555-118-2043",
      barber: alex,
      service: classicHaircut,
      start: set(referenceDay, { hours: 9, minutes: 30, seconds: 0, milliseconds: 0 }),
      end: set(referenceDay, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
    },
    {
      id: "res-2",
      clientId: "client-2",
      clientName: "Maria Gomez",
      phone: "+1 555-274-6690",
      barber: jordan,
      service: beardTrim,
      start: set(referenceDay, { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }),
      end: set(referenceDay, { hours: 11, minutes: 20, seconds: 0, milliseconds: 0 }),
    },
    {
      id: "res-5",
      clientId: "client-1",
      clientName: "Carlos Pérez",
      phone: "+1 555-118-2043",
      barber: jordan,
      service: beardTrim,
      start: set(referenceDay, { hours: 16, minutes: 0, seconds: 0, milliseconds: 0 }),
      end: set(referenceDay, { hours: 16, minutes: 20, seconds: 0, milliseconds: 0 }),
    },
    {
      id: "res-3",
      clientId: "client-1",
      clientName: "Carlos Pérez",
      phone: "+1 555-118-2043",
      barber: alex,
      service: haircutAndBeard,
      start: set(tomorrow, { hours: 14, minutes: 0, seconds: 0, milliseconds: 0 }),
      end: set(tomorrow, { hours: 14, minutes: 50, seconds: 0, milliseconds: 0 }),
    },
    {
      id: "res-6",
      clientId: "client-4",
      clientName: "Sofia Ramirez",
      phone: "+1 555-467-1129",
      barber: jordan,
      service: classicHaircut,
      start: set(tomorrow, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 }),
      end: set(tomorrow, { hours: 9, minutes: 30, seconds: 0, milliseconds: 0 }),
    },
    {
      id: "res-4",
      clientId: "client-3",
      clientName: "Luis Fernandez",
      phone: "+1 555-392-8815",
      barber: jordan,
      service: classicHaircut,
      start: set(twoDaysFromNow, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
      end: set(twoDaysFromNow, { hours: 10, minutes: 30, seconds: 0, milliseconds: 0 }),
    },
    {
      id: "res-7",
      clientId: "client-2",
      clientName: "Maria Gomez",
      phone: "+1 555-274-6690",
      barber: alex,
      service: haircutAndBeard,
      start: set(twoDaysFromNow, { hours: 15, minutes: 30, seconds: 0, milliseconds: 0 }),
      end: set(twoDaysFromNow, { hours: 16, minutes: 20, seconds: 0, milliseconds: 0 }),
    },
    {
      id: "res-8",
      clientId: "client-1",
      clientName: "Carlos Pérez",
      phone: "+1 555-118-2043",
      barber: alex,
      service: classicHaircut,
      start: set(threeDaysFromNow, { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }),
      end: set(threeDaysFromNow, { hours: 11, minutes: 30, seconds: 0, milliseconds: 0 }),
    },
  ];

  return reservations.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Stand-in for "the reservations that belong to the signed-in client" until
// reservations are linked to real Firebase Auth uids in Firestore.
export const MOCK_CURRENT_CLIENT_ID = "client-1";
