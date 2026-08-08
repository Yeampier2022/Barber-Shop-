export type AppointmentStatus =
  | "pending"
  | "approved"
  | "declined";

// Retained so appointments created before the status-model update can still
// be interpreted correctly.
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
