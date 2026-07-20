import {
    addDays,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth as dfIsSameMonth,
    isSameDay as dfIsSameDay,
    isToday as dfIsToday,
    startOfDay,
    startOfWeek,
    startOfMonth,
} from "date-fns";

const BOOKING_WINDOW_DAYS = 30; // How far out can a booking be made

// Returns an array of dates beginning at startDate.
export function getNextDays(
    numberOfDays: number,
    startDate: Date = new Date()
): Date[] {
    const firstDay = startOfDay(startDate);

    return Array.from(
        { length: numberOfDays },
        (_, index) => addDays(firstDay, index)
    );
}

export function isSameDay(date1: Date, date2: Date) {
    return dfIsSameDay(date1, date2);
}

export function isToday(date: Date) {
    return dfIsToday(date);
}

export function formatWeekday(date: Date) {
    return format(date, "EEE");   // Mon
}

export function formatDay(date: Date) {
    return format(date, "d");     // 18
}

export function formatMonth(date: Date) {
    return format(date, "MMMM yyyy"); // July 2026
}

// Returns an array of dates that would be displayed in a standard month calendar view
export function getMonthGrid(month: Date): Date[] {
    const start = startOfWeek(startOfMonth(month));
    const end = startOfWeek(endOfMonth(month));
    const dates: Date[] = [];

    let current = start;
    while (current <= end) {
        dates.push(current);
        current = addDays(current, 1);
    }
    return dates;
}

// Determines if the month provided is the same as the month of the date (for display purposes)
export function isSameMonth(date: Date, month: Date) {
    return dfIsSameMonth(date, month);
}

// Returns what dates are in the booking window
export function getBookingWindow() {
    const today = startOfDay(new Date());
    return {
        minDate: today,
        maxDate: addDays(today, BOOKING_WINDOW_DAYS),
    }
}

// Compares date to the booking window (for display purposes)
export function isDateInWindow(date: Date) {
    const window = getBookingWindow();
    return date >= window.minDate && date <= window.maxDate;
}