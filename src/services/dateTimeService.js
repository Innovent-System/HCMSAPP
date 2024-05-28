import { format, parseISO,formatISO ,parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
export {
    addDays, isEqual, format, startOfDay, parseISO, differenceInSeconds,
    differenceInMilliseconds, differenceInMinutes, intervalToDuration
} from 'date-fns';



export const formateISODateTime = (date) => {
    if (!date) return "";
    return format(parseISO(date), "dd-MMM-yyyy 'at' h:mm:ss a");
}

export const formateISOTime = (date) => {
    if (!date) return "";
    return format(parseISO(date), "h:mm:ss a");
}
export const formateDate = (date) => {
    if (!date) return "";
    return format(date, "dd-MMM-yyyy");
}

export const formateISODate = (date) => {
    if (!date) return "";
    return format(parseISO(date), "dd-MMM-yyyy");
}
export const getWeekStartEnd = (date = new Date()) => {

    return {
        weekStart: startOfWeek(date),
        weekEnd: endOfWeek(date)
    };
}
export const getMonthStartEnd = (date = new Date()) => {
    return {
        monthStart: startOfMonth(date),
        monthEnd: endOfMonth(date)
    };
}
export const dateRange = (start, end) => {
    return eachDayOfInterval({
        start,
        end
    });
}
