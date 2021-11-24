import Decimal from "decimal.js";
import { isFinite, isNumber, isString } from "lodash";
export { isNumber };

/**
 * Finds the item closest to the goal from the list of items.
 * If two items are equal distance to the goal the item that is first in the
 * list will be selected.
 */
export function findClosestNumber(items: number[], goal: number): number {
  if (!items || items.length === 0) {
    return 0;
  }
  const target = new Decimal(goal);
  const safeItems: Decimal[] = items.map((i) => new Decimal(i));
  return safeItems
    .reduce((prev, curr) => {
      const currentDiff = curr.minus(target).abs();
      const previousDiff = prev.minus(target).abs();
      if (currentDiff.lessThan(previousDiff)) {
        return curr;
      } else {
        return prev;
      }
    })
    .toNumber();
}

export function parseNumber(something: any): number {
  if (isFinite(something)) {
    return something;
  }

  if (isString(something)) {
    const parseResult = parseFloat(something);
    if (isFinite(parseResult)) {
      return parseResult;
    } else {
      return 0;
    }
  }
  return 0;
}

export function parseIntegerString(
  numberString: string | null | undefined
): number | undefined {
  if (numberString === undefined || numberString === null) {
    return undefined;
  }
  const result = parseInt(numberString, 10);
  if (isNaN(result)) {
    return undefined;
  }
  return result;
}

export function inRange(value: number, start: number, end: number): boolean {
  return value >= start && value <= end;
}

export function inRanges(
  value: number,
  ranges: Array<{ start: number; end: number }>
): boolean {
  return ranges.some((range) => inRange(value, range.start, range.end));
}

export function generateNumberRange(
  start: number,
  end: number,
  step: number = 1
): number[] {
  return Array(Math.ceil((end - start) / step) + 1)
    .fill(start)
    .map((x, y) => x + y * step);
}

export function sumNumbers(values: number[]): number {
  return values.reduce((total, item) => total + item, 0);
}

export function averageNumbers(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return sumNumbers(values) / values.length;
}

export function toPlaces(value: number, places: number = 2): number {
  return new Decimal(value).toDecimalPlaces(places).toNumber();
}
