import joi from 'joi';
import { isString } from './stringValidation';

export function isUri(string: string) {
  if (!isString(string)) {
    return false;
  }
  try {
    joi.assert(string, joi.string().uri());
    return true;
  } catch (error) {
    return false;
  }
}
