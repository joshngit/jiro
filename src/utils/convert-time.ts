import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export const convertFromJST = (date: Date) => {
  return toZonedTime(date, 'JST');
};

export const convertToJST = (date: Date) => {
  return fromZonedTime(date, 'JST');
};
