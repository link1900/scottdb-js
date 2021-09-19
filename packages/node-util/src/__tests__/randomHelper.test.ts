import { randomCharacter, randomInteger, randomIntegerArray, randomOption, randomString } from "../randomHelper";

describe("randomHelper", () => {
  describe("randomInteger", () => {
    it("gets a random integer between min integer and max integer", () => {
      const result = randomInteger();
      expect(result).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
      expect(result).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
    });

    it("gets a random integer between provided min and max", () => {
      const result = randomInteger(0, 100);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it("gets a random integer 0, 1", () => {
      const result = randomInteger(0, 1);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });

  describe("randomIntegerArray", () => {
    it("gets a random array of integers", () => {
      const result = randomIntegerArray(5, 0, 10);
      expect(result.length).toEqual(5);
      expect(result.every((i) => i >= 0 && i <= 10)).toEqual(true);
    });
  });

  describe("randomOption", () => {
    it("gets a item from the provided array", () => {
      const result = randomOption([1, 2, 3]);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(3);
    });
  });

  describe("randomCharacter", () => {
    it("gets a random character", () => {
      const result = randomCharacter();
      expect(result).toBeTruthy();
    });
  });

  describe("randomString", () => {
    it("gets a random string", () => {
      const result = randomString(6);
      expect(result).toBeTruthy();
      expect(result.length).toEqual(6);
    });
  });
});
