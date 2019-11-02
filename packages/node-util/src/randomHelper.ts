import { generateArray } from './arrayHelper';

export const NUMBERS = '0123456789';
export const CHARS_LOWER = 'abcdefghijklmnopqrstuvwxyz';
export const CHARS_UPPER = CHARS_LOWER.toUpperCase();
export const SYMBOLS = '!@#$%^&*()[]';
export const ALL_CHARACTERS = NUMBERS + CHARS_LOWER + CHARS_UPPER + SYMBOLS;

export function randomInteger(min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomIntegerArray(
  length: number,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): number[] {
  return generateArray(length, () => randomInteger(min, max));
}

export function randomOption<T>(options: T[]): T {
  return options[randomInteger(0, options.length - 1)];
}

export function randomCharacter(characterString: string = ALL_CHARACTERS) {
  return characterString.charAt(randomInteger(0, characterString.length - 1));
}

export function randomString(length: number, characterString: string = ALL_CHARACTERS) {
  return generateArray(length, () => randomCharacter(characterString)).join('');
}
