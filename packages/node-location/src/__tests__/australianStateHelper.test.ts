import { AustralianState } from "../AustralianState";
import { AustralianStateCode } from "../AustralianStateCode";
import {
  australianStateCodeToString,
  australianStateToString,
  getAustralianStateForCode,
  getTimezoneForAustralianState,
  stringToAustralianState,
  stringToAustralianStateCode,
} from "../australianStateHelper";
import { Timezone } from "../Timezone";

describe("stringToAustralianStateCode()", () => {
  [
    { value: "", expected: undefined },
    { value: undefined, expected: undefined },
    { value: null, expected: undefined },
    { value: "NSW", expected: AustralianStateCode.NSW },
    { value: "NEW SOUTH WALES", expected: AustralianStateCode.NSW },
    { value: "New South Wales", expected: AustralianStateCode.NSW },
    { value: "act", expected: AustralianStateCode.ACT },
    { value: "nsw", expected: AustralianStateCode.NSW },
    { value: "nt", expected: AustralianStateCode.NT },
    { value: "qld", expected: AustralianStateCode.QLD },
    { value: "sa", expected: AustralianStateCode.SA },
    { value: "tas", expected: AustralianStateCode.TAS },
    { value: "vic", expected: AustralianStateCode.VIC },
    { value: "wa", expected: AustralianStateCode.WA },
  ].forEach(({ value, expected }: any) => {
    it(`maps string ${value} to ${expected}`, () => {
      expect(stringToAustralianStateCode(value)).toEqual(expected);
    });
  });
});

describe("australianStateCodeToString()", () => {
  [
    {
      value: AustralianStateCode.ACT,
      expected: "Australian Capital Territory",
    },
    { value: AustralianStateCode.NSW, expected: "New South Wales" },
    { value: AustralianStateCode.NT, expected: "Northern Territory" },
    { value: AustralianStateCode.QLD, expected: "Queensland" },
    { value: AustralianStateCode.SA, expected: "South Australia" },
    { value: AustralianStateCode.TAS, expected: "Tasmania" },
    { value: AustralianStateCode.VIC, expected: "Victoria" },
    { value: AustralianStateCode.WA, expected: "Western Australia" },
  ].forEach(({ value, expected }: any) => {
    it(`maps enum value ${value} to ${expected}`, () => {
      expect(australianStateCodeToString(value)).toEqual(expected);
    });
  });
});

describe("stringToAustralianState()", () => {
  [
    { value: "", expected: undefined },
    { value: undefined, expected: undefined },
    { value: null, expected: undefined },
    { value: "NSW", expected: AustralianState.NEW_SOUTH_WALES },
    { value: "NEW SOUTH WALES", expected: AustralianState.NEW_SOUTH_WALES },
    { value: "New South Wales", expected: AustralianState.NEW_SOUTH_WALES },
    { value: "act", expected: AustralianState.AUSTRALIAN_CAPITAL_TERRITORY },
    { value: "nsw", expected: AustralianState.NEW_SOUTH_WALES },
    { value: "nt", expected: AustralianState.NORTHERN_TERRITORY },
    { value: "qld", expected: AustralianState.QUEENSLAND },
    { value: "sa", expected: AustralianState.SOUTH_AUSTRALIA },
    { value: "tas", expected: AustralianState.TASMANIA },
    { value: "vic", expected: AustralianState.VICTORIA },
    { value: "wa", expected: AustralianState.WESTERN_AUSTRALIA },
  ].forEach(({ value, expected }: any) => {
    it(`maps string ${value} to ${expected}`, () => {
      expect(stringToAustralianState(value)).toEqual(expected);
    });
  });
});

describe("australianStateToString()", () => {
  [
    {
      value: AustralianState.AUSTRALIAN_CAPITAL_TERRITORY,
      expected: "Australian Capital Territory",
    },
    { value: AustralianState.NEW_SOUTH_WALES, expected: "New South Wales" },
    {
      value: AustralianState.NORTHERN_TERRITORY,
      expected: "Northern Territory",
    },
    { value: AustralianState.QUEENSLAND, expected: "Queensland" },
    { value: AustralianState.SOUTH_AUSTRALIA, expected: "South Australia" },
    { value: AustralianState.TASMANIA, expected: "Tasmania" },
    { value: AustralianState.VICTORIA, expected: "Victoria" },
    { value: AustralianState.WESTERN_AUSTRALIA, expected: "Western Australia" },
  ].forEach(({ value, expected }: any) => {
    it(`maps enum value ${value} to ${expected}`, () => {
      expect(australianStateToString(value)).toEqual(expected);
    });
  });
});

describe("getAustralianStateForCode()", () => {
  [
    {
      value: AustralianStateCode.ACT,
      expected: AustralianState.AUSTRALIAN_CAPITAL_TERRITORY,
    },
    {
      value: AustralianStateCode.NSW,
      expected: AustralianState.NEW_SOUTH_WALES,
    },
    {
      value: AustralianStateCode.NT,
      expected: AustralianState.NORTHERN_TERRITORY,
    },
    { value: AustralianStateCode.QLD, expected: AustralianState.QUEENSLAND },
    {
      value: AustralianStateCode.SA,
      expected: AustralianState.SOUTH_AUSTRALIA,
    },
    { value: AustralianStateCode.TAS, expected: AustralianState.TASMANIA },
    { value: AustralianStateCode.VIC, expected: AustralianState.VICTORIA },
    {
      value: AustralianStateCode.WA,
      expected: AustralianState.WESTERN_AUSTRALIA,
    },
  ].forEach(({ value, expected }: any) => {
    it(`maps enum value ${value} to ${expected}`, () => {
      expect(getAustralianStateForCode(value)).toEqual(expected);
    });
  });
});

describe("getTimezoneForAustralianState()", () => {
  [
    {
      value: AustralianState.AUSTRALIAN_CAPITAL_TERRITORY,
      expected: Timezone.AUSTRALIA_SYDNEY,
    },
    {
      value: AustralianState.NEW_SOUTH_WALES,
      expected: Timezone.AUSTRALIA_SYDNEY,
    },
    {
      value: AustralianState.NORTHERN_TERRITORY,
      expected: Timezone.AUSTRALIA_DARWIN,
    },
    {
      value: AustralianState.QUEENSLAND,
      expected: Timezone.AUSTRALIA_BRISBANE,
    },
    {
      value: AustralianState.SOUTH_AUSTRALIA,
      expected: Timezone.AUSTRALIA_ADELAIDE,
    },
    { value: AustralianState.TASMANIA, expected: Timezone.AUSTRALIA_HOBART },
    { value: AustralianState.VICTORIA, expected: Timezone.AUSTRALIA_MELBOURNE },
    {
      value: AustralianState.WESTERN_AUSTRALIA,
      expected: Timezone.AUSTRALIA_PERTH,
    },
    {
      value: AustralianState.NEW_SOUTH_WALES,
      locality: "Lindeman",
      expected: Timezone.AUSTRALIA_LINDEMAN,
    },
    {
      value: AustralianState.NEW_SOUTH_WALES,
      locality: "Lord Howe",
      expected: Timezone.AUSTRALIA_LORD_HOWE,
    },
    {
      value: AustralianState.WESTERN_AUSTRALIA,
      locality: "Eucla",
      expected: Timezone.AUSTRALIA_EUCLA,
    },
    {
      value: AustralianState.NEW_SOUTH_WALES,
      locality: "Broken hill",
      expected: Timezone.AUSTRALIA_BROKEN_HILL,
    },
    {
      value: AustralianState.TASMANIA,
      locality: "Currie",
      expected: Timezone.AUSTRALIA_HOBART,
    },
  ].forEach(({ value, locality, expected }: any) => {
    it(`maps enum value ${value} to ${expected}`, () => {
      expect(getTimezoneForAustralianState(value, locality)).toEqual(expected);
    });
  });
});
