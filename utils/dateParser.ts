import { format, parse, compareDesc } from 'date-fns';

export const parseToDate = (date: string): Date => {
  return parse(date, 'yyyy/MM/dd', new Date());
};

export const formtDateToDD = (date: string, dateFormat: string = 'dd/MM/yyyy'): string => {
  const tempDate = new Date(date);
  return format(tempDate, dateFormat);
};

export const formatDateToYYYY = (date: string): string => {
  return format(parseToDate(date), 'yyyy/MM/dd');
};

export const compareTwoDate = (startDate: string, endDate: string): number => {
  const temStartDate = parseToDate(startDate);
  const tempEndDate = parseToDate(endDate);
  return compareDesc(temStartDate, tempEndDate);
};
