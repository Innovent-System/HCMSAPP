import { format, parseISO } from 'date-fns'
export { addDays, isEqual, format, startOfDay, parseISO } from 'date-fns';



export const formateISODateTime = (date) => {
    return format(parseISO(date), "dd-MM-yyyy 'at' h:mm a");
}

export const formateISOTime = (date) => {
    return format(parseISO(date), "h:mm a");
}