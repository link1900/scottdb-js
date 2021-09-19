import { InternalServerError } from "@link1900/node-error";
import { isObject, isString, isDate, isNumber, isArray } from "lodash";

export type ReplacementValueType = "string" | "number" | "date";

export type ReplacementRule = {
  keyRegex?: RegExp;
  valueRegex?: RegExp;
  valueType?: ReplacementValueType;
  mapping: (value: any, parent: object) => any;
};

export function unwrap<T>(value: T | undefined | null): T {
  if (value === null || value === undefined) {
    throw new InternalServerError("Attempted to unwrap value but was null or undefined");
  }
  return value;
}

export function exists<T>(value?: T): boolean {
  return !(value === null || value === undefined);
}

export function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

const jsonToStringRules: ReplacementRule[] = [
  {
    valueType: "date",
    mapping: (date: Date) => `___date___${date.toISOString()}`,
  },
];

const jsonParseRules: ReplacementRule[] = [
  {
    valueRegex: /___date___/,
    mapping: (value: string) => new Date(value.replace("___date___", "")),
  },
];

export function walkObjectAndReplace(object: object, replacementRules: ReplacementRule[]): object {
  let result = {};
  const objectKeys = Object.keys(object);
  objectKeys.forEach((objectKey) => {
    const objectValue = object[objectKey];
    result[objectKey] = replaceField(objectKey, objectValue, replacementRules, object);
  });
  return result;
}

export function replaceField(
  objectKey: string,
  objectValue: any,
  replacementRules: ReplacementRule[],
  parent: object
): any {
  if (isString(objectValue) || isDate(objectValue) || isNumber(objectValue)) {
    // find any matching replacement rules
    const replacement = replacementRules.find((rule: ReplacementRule) => {
      return evaluateReplacementRule(objectKey, objectValue, rule);
    });

    // apply the mapping function if there was a match
    return replacement ? replacement.mapping(objectValue, parent) : objectValue;
  } else if (isArray(objectValue)) {
    return objectValue.map((item, index) => replaceField(`${index}`, item, replacementRules, parent));
  } else if (isObject(objectValue)) {
    return walkObjectAndReplace(objectValue, replacementRules);
  }
}

export function evaluateReplacementRule(
  objectKey: string,
  objectValue: any,
  replacementRule: ReplacementRule
): boolean {
  const { keyRegex, valueRegex, valueType } = replacementRule;
  if (keyRegex && objectKey.match(keyRegex)) {
    return true;
  }

  if (valueRegex && isString(objectValue) && objectValue.match(valueRegex)) {
    return true;
  }

  if (valueType) {
    switch (valueType) {
      case "date":
        return isDate(objectValue);
      case "number":
        return isNumber(objectValue);
      case "string":
        return isString(objectValue);
    }
  }

  return false;
}

export function objectToJsonObject(val: object): object {
  return walkObjectAndReplace(val, jsonToStringRules);
}

export function jsonObjectToObject(val: object): object {
  return walkObjectAndReplace(val, jsonParseRules);
}

export function objectToString(object: object): string {
  if (!isObject(object)) {
    return "";
  }

  return JSON.stringify(object);
}

export function stringToObject(string: string): object {
  try {
    const result = JSON.parse(string);
    if (!result) {
      return {};
    }
    return result;
  } catch (error) {
    return {};
  }
}

export function serializeObjectToString(val: object): string {
  return objectToString(objectToJsonObject(val));
}

export function deserializeStringToObject(val: string): object {
  return jsonObjectToObject(stringToObject(val));
}
