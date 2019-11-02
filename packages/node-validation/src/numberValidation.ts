import joi from 'joi';
import { isNumber } from 'lodash';

export { isNumber };

export interface NumberValidationOptions {
  min?: number;
  max?: number;
  isOnly?: number[];
}

export function isValidNumber(value?: any, options?: NumberValidationOptions) {
  if (!isNumber(value)) {
    return false;
  }
  if (!options) {
    return true;
  }
  const { min, max, isOnly } = options;

  if (min) {
    try {
      joi.assert(value, joi.number().min(min));
    } catch (error) {
      return false;
    }
  }

  if (max) {
    try {
      joi.assert(
        value,
        joi
          .number()
          .optional()
          .max(max)
      );
    } catch (error) {
      return false;
    }
  }

  return !(isOnly && !isOnly.includes(value));
}
