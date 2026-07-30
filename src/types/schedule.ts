export type TimeSlot = {
  start: Date;
  end: Date;
  isBookable: boolean;
};

export type SlotState = 
  | "available"
  | "selected"
  | "unavailable";

export type Appointment = {
  barberId: string;
  clientId: string;
  start: Date;
  end: Date;
}