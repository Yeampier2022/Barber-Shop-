export type CreateAppointmentInput  = {
  clientId: string;
  barberId: string;
  serviceId: string
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  price: number;
}