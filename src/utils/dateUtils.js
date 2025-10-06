import { format, parseISO } from 'date-fns';

export const formatDate = (dateString, dateFormat = 'MMM dd, yyyy') => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    return format(date, dateFormat);
};

export const isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
};