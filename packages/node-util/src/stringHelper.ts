import { isArray, isString, isEmpty } from "lodash";
import zlib from "zlib";
import crypto from "crypto";
import prettyBytes from "pretty-bytes";
import { v4 as uuidv4 } from "uuid";

export { isString, isEmpty };

export function arrayToString(
  fields: Array<string | null | undefined> = [],
  separator: string = " "
): string {
  if (!isArray(fields)) {
    return "";
  }
  return fields
    .filter((x) => isString(x))
    .map((field) => field && field.trim())
    .filter((x) => !isEmpty(x))
    .join(separator)
    .trim();
}

export function stringToArray(
  field?: string | null,
  separator: string = " "
): string[] {
  if (field === undefined || field === null) {
    return [];
  }

  return field.split(separator).filter((x) => !isEmpty(x));
}

export function filterForOnlyLetters(
  value?: string,
  regex: string | RegExp = /[^a-zA-Z\s]/g
): string {
  if (!value) {
    return "";
  }

  return value.replace(regex, "");
}

export function base64Encode(text?: string): string {
  if (!isString(text)) {
    return "";
  }
  return Buffer.from(text, "ascii").toString("base64");
}

export function base64Decode(text?: string): string {
  if (!isString(text)) {
    return "";
  }
  return Buffer.from(text, "base64").toString("ascii");
}

export function getHashForString(string: string): string {
  return crypto.createHash("sha1").update(string).digest("base64");
}

export function getHash(something: any): string {
  return getHashForString(anyToObjectString(something));
}

export function anyToObjectString(value: any): string {
  return JSON.stringify({
    value,
  });
}

export function objectStringToObject(string: string): any {
  try {
    const result = JSON.parse(string);
    if (result === undefined || result === null || result.value === undefined) {
      return undefined;
    }
    return result.value;
  } catch (error) {
    return undefined;
  }
}

export async function zipStringToString(string: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    zlib.gzip(string, (err, buffer: Buffer) => {
      if (err) {
        reject(err);
        return undefined;
      }
      resolve(buffer.toString("base64"));
      return undefined;
    });
  });
}

export async function unzipStringToString(zipString: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    zlib.gunzip(Buffer.from(zipString, "base64"), (err, buffer) => {
      if (err) {
        reject(err);
        return undefined;
      }
      resolve(buffer.toString());
      return undefined;
    });
  });
}

export async function serializeToString(something: any): Promise<string> {
  return zipStringToString(anyToObjectString(something));
}

export async function deserializeFromString(string: string): Promise<any> {
  if (!isString(string)) {
    return undefined;
  }
  const unzippedString = await unzipStringToString(string);
  return objectStringToObject(unzippedString);
}

export function formatBytes(bytes: number): string {
  return prettyBytes(bytes);
}

export function stringToBoolean(value?: string): boolean {
  return (
    isString(value) &&
    ["true", "t", "yes", "y", "1", "on", "active", "valid"].includes(
      value.trim().toLowerCase()
    )
  );
}

export function uuid(): string {
  return uuidv4();
}
