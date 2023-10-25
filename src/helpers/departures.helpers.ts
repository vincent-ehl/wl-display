import { differenceInMinutes } from "date-fns";

export function departureTimeToMinutes(timeReal: string): string {
  const departureTime = new Date(timeReal);
  let minutes: string | number = differenceInMinutes(departureTime, new Date());
  if (minutes < 1) {
    return "*";
  }

  return minutes.toString();
}
