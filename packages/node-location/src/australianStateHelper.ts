import { AustralianState } from "./AustralianState";
import { AustralianStateCode } from "./AustralianStateCode";
import { Timezone } from "./Timezone";

interface StateMapping {
  names: string[];
  code: AustralianStateCode;
  value: AustralianState;
}

const stateStringMap: StateMapping[] = [
  {
    names: ["ACT", "AUSTRALIAN CAPITAL TERRITORY"],
    code: AustralianStateCode.ACT,
    value: AustralianState.AUSTRALIAN_CAPITAL_TERRITORY,
  },
  {
    names: ["NSW", "NEW SOUTH WALES"],
    code: AustralianStateCode.NSW,
    value: AustralianState.NEW_SOUTH_WALES,
  },
  {
    names: ["NT", "NORTHERN TERRITORY"],
    code: AustralianStateCode.NT,
    value: AustralianState.NORTHERN_TERRITORY,
  },
  {
    names: ["QLD", "QUEENSLAND"],
    code: AustralianStateCode.QLD,
    value: AustralianState.QUEENSLAND,
  },
  {
    names: ["SA", "SOUTH AUSTRALIA"],
    code: AustralianStateCode.SA,
    value: AustralianState.SOUTH_AUSTRALIA,
  },
  {
    names: ["TAS", "TASMANIA"],
    code: AustralianStateCode.TAS,
    value: AustralianState.TASMANIA,
  },
  {
    names: ["VIC", "VICTORIA"],
    code: AustralianStateCode.VIC,
    value: AustralianState.VICTORIA,
  },
  {
    names: ["WA", "WESTERN AUSTRALIA"],
    code: AustralianStateCode.WA,
    value: AustralianState.WESTERN_AUSTRALIA,
  },
];

function convertToLocationString(value: string): string {
  return value.toUpperCase().trim();
}

function isLocality(
  value: string | null | undefined,
  expected: string
): boolean {
  if (!value || value.length === 0) {
    return false;
  }
  return convertToLocationString(value) === expected;
}

function findStateMappingForString(
  stateString?: string | null
): StateMapping | undefined {
  if (!stateString || stateString.length === 0) {
    return undefined;
  }
  const cleanStateString = convertToLocationString(stateString);
  return stateStringMap.find((state) => state.names.includes(cleanStateString));
}

export function stringToAustralianStateCode(
  stateString?: string | null
): AustralianStateCode | undefined {
  const found = findStateMappingForString(stateString);
  if (!found) {
    return undefined;
  }
  return found.code;
}

export function australianStateCodeToString(code: AustralianStateCode): string {
  return australianStateToString(getAustralianStateForCode(code));
}

export function stringToAustralianState(
  stateString?: string | null
): AustralianState | undefined {
  const found = findStateMappingForString(stateString);
  if (!found) {
    return undefined;
  }
  return found.value;
}

export function australianStateToString(state: AustralianState): string {
  return state.toString();
}

export function getAustralianStateForCode(
  code: AustralianStateCode
): AustralianState {
  switch (code) {
    case AustralianStateCode.ACT:
      return AustralianState.AUSTRALIAN_CAPITAL_TERRITORY;
    case AustralianStateCode.NSW:
      return AustralianState.NEW_SOUTH_WALES;
    case AustralianStateCode.NT:
      return AustralianState.NORTHERN_TERRITORY;
    case AustralianStateCode.QLD:
      return AustralianState.QUEENSLAND;
    case AustralianStateCode.SA:
      return AustralianState.SOUTH_AUSTRALIA;
    case AustralianStateCode.TAS:
      return AustralianState.TASMANIA;
    case AustralianStateCode.VIC:
      return AustralianState.VICTORIA;
    case AustralianStateCode.WA:
      return AustralianState.WESTERN_AUSTRALIA;
  }
}

export function getTimezoneForAustralianState(
  state: AustralianState,
  locality?: string
): Timezone {
  if (isLocality(locality, "LINDEMAN")) {
    return Timezone.AUSTRALIA_LINDEMAN;
  }
  if (isLocality(locality, "LORD HOWE")) {
    return Timezone.AUSTRALIA_LORD_HOWE;
  }
  if (isLocality(locality, "EUCLA")) {
    return Timezone.AUSTRALIA_EUCLA;
  }
  if (isLocality(locality, "BROKEN HILL")) {
    return Timezone.AUSTRALIA_BROKEN_HILL;
  }
  switch (state) {
    case AustralianState.AUSTRALIAN_CAPITAL_TERRITORY:
      return Timezone.AUSTRALIA_SYDNEY;
    case AustralianState.NEW_SOUTH_WALES:
      return Timezone.AUSTRALIA_SYDNEY;
    case AustralianState.NORTHERN_TERRITORY:
      return Timezone.AUSTRALIA_DARWIN;
    case AustralianState.QUEENSLAND:
      return Timezone.AUSTRALIA_BRISBANE;
    case AustralianState.SOUTH_AUSTRALIA:
      return Timezone.AUSTRALIA_ADELAIDE;
    case AustralianState.TASMANIA:
      return Timezone.AUSTRALIA_HOBART;
    case AustralianState.VICTORIA:
      return Timezone.AUSTRALIA_MELBOURNE;
    case AustralianState.WESTERN_AUSTRALIA:
      return Timezone.AUSTRALIA_PERTH;
  }
}
