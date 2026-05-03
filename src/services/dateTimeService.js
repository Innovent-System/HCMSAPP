import { format, parseISO, formatISO, parse, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
export {
    addDays, isEqual, format, startOfDay, parseISO, differenceInSeconds,
    differenceInMilliseconds, differenceInMinutes, intervalToDuration, endOfDay
} from 'date-fns';



export const formateISODateTime = (date) => {
    if (!date) return "";
    return format(parseISO(date), "dd-MMM-yyyy 'at' hh:mm:ss a");
}

export const parseTime = (timeString) => timeString ? parse(timeString, "HH:mm:ss", new Date()) : timeString;

export const formateISOTime = (date) => {
    if (!date) return "";
    return format(parse(date, "HH:mm:ss", new Date()), "hh:mm:ss a");
}

export const formateDate = (date) => {
    if (!date) return "";
    return format(date, "dd-MMM-yyyy");
}

export const systemFormatDate = (date) => {
    if (!date) return date;
    return format(date, "yyyy-MM-dd");
}

export const systemDateTime = (date) => {
    if (!date) return date;
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export const systemTime = (date) => {
    if (!date) return date;
    return format(date, "HH:mm:ss");
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
