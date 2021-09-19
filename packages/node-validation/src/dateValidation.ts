import joi from "joi";
import moment from "moment-timezone";
import { isString } from "./stringValidation";

export function isFutureDate(date?: Date) {
  if (!date) {
    return false;
  }
  return moment().isSameOrBefore(date);
}

export function isValidISODateString(dateString?: string) {
  if (!isString(dateString)) {
    return false;
  }

  try {
    joi.assert(dateString, joi.date().iso());
  } catch (error) {
    return false;
  }

  return true;
}
