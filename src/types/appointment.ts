export type AppointmentStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type ConfirmationStatus =
  | "pending"
  | "confirmed"
  | "declined";

export type CreateAppointmentInput = {
  clientId: string;
  barberId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  price: number;
};
