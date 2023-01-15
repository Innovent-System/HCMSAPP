import { format, parseISO } from 'date-fns'
export { addDays, isEqual, format, startOfDay, parseISO } from 'date-fns';



export const formateISODateTime = (date) => {
    return format(parseISO(date), "dd-MMM-yyyy 'at' h:mm:ss a");
}

export const formateISOTime = (date) => {
    return format(parseISO(date), "h:mm:ss a");
}

export const formateISODate = (date) => {
    return format(parseISO(date), "dd-MMM-yyyy");
}