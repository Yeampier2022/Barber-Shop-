import {
    addDays,
    format,
    isSameDay as dfIsSameDay,
    isToday as dfIsToday,
    startOfDay,
} from "date-fns";

/**
 * Returns an array of dates beginning at startDate.
 */
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