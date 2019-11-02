import joi from 'joi';
import { isString } from 'lodash';

export { isString };

export interface StringValidationOptions {
  min?: number;
  max?: number;
  regex?: RegExp;
}

export function isValidString(value?: string, options?: StringValidationOptions) {
  if (!isString(value)) {
    return false;
  }
  if (!options) {
    return true;
  }
  const { min, max, regex } = options;

  if (min && value.length < min) {
    try {
      joi.assert(value, joi.string().min(min));
    } catch (error) {
      return false;
    }
  }

  if (max) {
    try {
      joi.assert(
        value,
        joi
          .string()
          .optional()
          .empty('')
          .max(max)
      );
    } catch (error) {
      return false;
    }
  }

  if (regex) {
    try {
      joi.assert(value, joi.string().regex(regex));
    } catch (error) {
      return false;
    }
  }

  return true;
}
