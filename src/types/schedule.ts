export type TimeSlot = {
  start: Date;
  end: Date;
  isBookable: boolean;
};

export type SlotState = 
  | "available"
  | "selected"
  | "unavailable";