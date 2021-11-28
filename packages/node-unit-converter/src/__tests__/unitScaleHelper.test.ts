import { Decimal } from "decimal.js";
import { CURRENCY_SCALE, CurrencyUnit } from "../units/CurrencyUnit";
import {
  convertDecimalUnitForScale,
  findUnitDefinitionForScale,
  getUnitForCodeInScale,
  convertNumberUnitForScale,
} from "../unitScaleHelper";

describe("findUnitDefinitionForScale()", () => {
  it("returns correct definition for type", () => {
    expect(
      findUnitDefinitionForScale(CURRENCY_SCALE, CurrencyUnit.CENT)
    ).toEqual(CURRENCY_SCALE.units[0]);
  });

  it("returns undefined when nothing is found", () => {
    expect(
      findUnitDefinitionForScale(CURRENCY_SCALE, "nothing" as any)
    ).toEqual(undefined);
  });
});

describe("convertDecimalUnitForScale()", () => {
  it("does the conversion correctly", () => {
    expect(
      convertDecimalUnitForScale(
        new Decimal(1),
        CurrencyUnit.DOLLAR,
        CurrencyUnit.CENT,
        CURRENCY_SCALE
      ).toNumber()
    ).toEqual(100);
  });

  it("throws error when the definition is not found", () => {
    expect(() =>
      convertDecimalUnitForScale(
        new Decimal(1),
        CurrencyUnit.CENT,
        "nothing" as any,
        CURRENCY_SCALE
      )
    ).toThrowError("Conversion failed");
  });
});

describe("convertNumberUnitForScale()", () => {
  it("does the conversion correctly", () => {
    expect(
      convertNumberUnitForScale(
        1,
        CurrencyUnit.DOLLAR,
        CurrencyUnit.CENT,
        CURRENCY_SCALE
      )
    ).toEqual(100);
  });
});

describe("getUnitForCodeInScale()", () => {
  it("returns the correct unit type for the code", () => {
    expect(getUnitForCodeInScale("$", CURRENCY_SCALE)).toEqual(
      CurrencyUnit.DOLLAR
    );
  });

  it("returns undefined in no matching code is found", () => {
    expect(getUnitForCodeInScale("unknown", CURRENCY_SCALE)).toEqual(undefined);
  });
});
