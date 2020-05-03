import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import { ENV } from "../env";

const dateNow = new Date(Date.now());

const formatOptions: DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false,
};

export function formatDate(date: Date): string {
  const intlDate = new Intl.DateTimeFormat("default", formatOptions).format(date);
  return intlDate.replace(/:/g, `.`).replace(/\//g, `.`).replace(/, /g, `-`);
}

export const appStartDate = ENV.CUSTOM_DATE ?? formatDate(dateNow);
