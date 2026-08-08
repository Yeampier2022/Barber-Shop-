export type CalendarDay = {
    date: Date;
    currentMonth: boolean;
    isBookable: boolean;
}

export type DayState = 
    | "default"
    | "selected"
    | "today"
    | "muted"
    | "disabled";
