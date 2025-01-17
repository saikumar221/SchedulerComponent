import { NewScheduleRecord } from "@/app/types";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}


/**
 * Checks if a given date string is a valid date.
 *
 * @param dateString - The date string to validate.
 * @returns `true` if the date string is a valid date, otherwise `false`.
 */
export const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidScheduleData = (scheduleData: NewScheduleRecord) => {
  return true;
};

export function convertUTCToTimezone(utcDate: Date | string, timeZone: string): string {
  const date = new Date(utcDate);
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
