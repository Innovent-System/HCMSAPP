import { format, parseISO, parse, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
export {
    addDays, isEqual, format, startOfDay, parseISO, differenceInSeconds,
    differenceInMilliseconds, differenceInMinutes, intervalToDuration
} from 'date-fns';



export const formateISODateTime = (date) => {
    return format(parseISO(date), "dd-MMM-yyyy 'at' h:mm:ss a");
}

export const formateISOTime = (date) => {
    return format(parseISO(date), "h:mm:ss a");
}
export const formateDate = (date) => {
    return format(date, "dd-MMM-yyyy");
}

export const formateISODate = (date) => {
    return format(parseISO(date), "dd-MMM-yyyy");
}
export const getWeekStartEnd = (date = new Date()) => {

    return {
        weekStart: startOfWeek(date),
        weekEnd: endOfWeek(date)
    };
}
export const dateRange = (start, end) => {
    return eachDayOfInterval({
        start,
        end
    });
}
