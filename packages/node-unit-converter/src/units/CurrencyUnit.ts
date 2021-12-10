import { Decimal } from "decimal.js";
import { UnitScale } from "../UnitScale";

export enum CurrencyUnit {
  CENT = "CENT",
  DOLLAR = "DOLLAR",
}

export const CURRENCY_SCALE: UnitScale<CurrencyUnit> = {
  name: "currency",
  units: [
    {
      type: CurrencyUnit.CENT,
      code: "¢",
      name: "cent",
      toAnchor: new Decimal(1),
    },
    {
      type: CurrencyUnit.DOLLAR,
      code: "$",
      name: "dollar",
      toAnchor: new Decimal(100),
    },
  ],
  anchor: CurrencyUnit.CENT,
};
