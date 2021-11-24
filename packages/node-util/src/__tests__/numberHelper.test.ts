import {
  averageNumbers,
  findClosestNumber,
  generateNumberRange,
  inRange,
  inRanges,
  parseNumber,
  sumNumbers,
  toPlaces,
  parseIntegerString,
} from "../numberHelper";

describe("numberHelper", () => {
  describe("#findClosestNumber", () => {
    const testCases = [
      { value: [1, 2, 3], goal: 2, expected: 2 },
      { value: [-2, 2, -2], goal: 2, expected: 2 },
      { value: [3, 2, 1], goal: 2, expected: 2 },
      { value: [1, 100], goal: 50, expected: 1 },
      { value: [-50, 50], goal: 1, expected: 50 },
      { value: [1000, -100, 3, 78, 40, 0], goal: 56, expected: 40 },
      { value: [], goal: 56, expected: 0 },
      { value: [10, 20, 30], goal: 12, expected: 10 },
      { value: [10.1, 10.5, 10.4, 8.2, 9.23, 10], goal: 10.2, expected: 10.1 },
      {
        value: [2, 0, -1.5, -0.75, -5, 3, -1.2, -2.1],
        goal: -1,
        expected: -1.2,
      },
      { value: [10, 15, 0, 20, 5], goal: 0, expected: 0 },
      { value: [10, 15, 0, 20, 5], goal: 2, expected: 0 },
      { value: [10, 15, 0, 20, 5], goal: 2.5, expected: 0 },
      { value: [10, 15, 0, 20, 5], goal: 9, expected: 10 },
      { value: [10, 30], goal: 20, expected: 10 },
      { value: [0.45, 0.47], goal: 0.46, expected: 0.45 },
    ];

    testCases.forEach((testCase) => {
      it(`finds ${testCase.expected} to be closest`, () => {
        expect(findClosestNumber(testCase.value, testCase.goal)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe("#parseNumber", () => {
    const testCases = [
      { value: 5, expected: 5 },
      { value: "5", expected: 5 },
      { value: -54000.45, expected: -54000.45 },
      { value: "-54000.45", expected: -54000.45 },
      { value: null, expected: 0 },
      { value: undefined, expected: 0 },
      { value: Infinity, expected: 0 },
      { value: -Infinity, expected: 0 },
      { value: NaN, expected: 0 },
      { value: "nope", expected: 0 },
    ];

    testCases.forEach((testCase) => {
      it(`parses ${testCase.value} as ${testCase.expected}`, () => {
        expect(parseNumber(testCase.value)).toEqual(testCase.expected);
      });
    });
  });

  describe("#parseIntegerString", () => {
    const testCases = [
      { value: "5", expected: 5 },
      { value: "", expected: undefined },
      { value: " ", expected: undefined },
      { value: "  5   ", expected: 5 },
      { value: "-54000.45", expected: -54000 },
      { value: null, expected: undefined },
      { value: undefined, expected: undefined },
      { value: "nope", expected: undefined },
    ];

    testCases.forEach((testCase) => {
      it(`parses ${testCase.value} as ${testCase.expected}`, () => {
        expect(parseIntegerString(testCase.value)).toEqual(testCase.expected);
      });
    });
  });

  describe("#inRange", () => {
    const testCases = [
      { value: 5, start: 1, end: 10, expected: true },
      { value: 50, start: 1, end: 10, expected: false },
    ];

    testCases.forEach((testCase) => {
      it(`finds ${testCase.value} is in between (inclusive) ${testCase.start} and ${testCase.end} as ${testCase.expected}`, () => {
        expect(inRange(testCase.value, testCase.start, testCase.end)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe("#inRanges", () => {
    const testCases = [
      { value: 5, ranges: [{ start: 1, end: 10 }], expected: true },
      { value: 50, ranges: [{ start: 1, end: 10 }], expected: false },
      {
        value: 50,
        ranges: [
          { start: 1, end: 100 },
          { start: 1, end: 10 },
        ],
        expected: true,
      },
      {
        value: 500,
        ranges: [
          { start: 1, end: 100 },
          { start: 1, end: 10 },
        ],
        expected: false,
      },
    ];

    testCases.forEach((testCase) => {
      it(`finds ${testCase.value} is in all provided ranges as ${testCase.expected}`, () => {
        expect(inRanges(testCase.value, testCase.ranges)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe("#generateNumberRange", () => {
    const testCases = [
      { start: 1, end: 10, step: 1, expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { start: 1, end: 10, expected: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { start: 0, end: 10, step: 2, expected: [0, 2, 4, 6, 8, 10] },
      { start: 1, end: 10, step: 3, expected: [1, 4, 7, 10] },
      {
        start: 0,
        end: 1000,
        step: 100,
        expected: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      },
    ];

    testCases.forEach((testCase) => {
      it(`generates ${testCase.expected} when start is ${testCase.start} and end is ${testCase.end}`, () => {
        expect(
          generateNumberRange(testCase.start, testCase.end, testCase.step)
        ).toEqual(testCase.expected);
      });
    });
  });

  describe("#sumNumbers", () => {
    const testCases = [
      { value: [1, 1], expected: 2 },
      { value: [-3, -2, 5], expected: 0 },
      { value: [], expected: 0 },
    ];

    testCases.forEach((testCase) => {
      it(`sums ${testCase.value} to ${testCase.expected}`, () => {
        expect(sumNumbers(testCase.value)).toEqual(testCase.expected);
      });
    });
  });

  describe("#averageNumbers", () => {
    const testCases = [
      { value: [1, 1], expected: 1 },
      { value: [], expected: 0 },
    ];

    testCases.forEach((testCase) => {
      it(`averages ${testCase.value} to ${testCase.expected}`, () => {
        expect(averageNumbers(testCase.value)).toEqual(testCase.expected);
      });
    });
  });

  describe("#toPlaces", () => {
    const testCases = [
      { value: 1, expected: 1.0 },
      { value: 1.333, expected: 1.33 },
      { value: 1.339, expected: 1.34 },
      { value: 1.339, places: 3, expected: 1.339 },
    ];

    testCases.forEach((testCase) => {
      it(`rounds number to specific number of places ${testCase.value} to ${testCase.expected}`, () => {
        expect(toPlaces(testCase.value, testCase.places)).toEqual(
          testCase.expected
        );
      });
    });
  });
});
