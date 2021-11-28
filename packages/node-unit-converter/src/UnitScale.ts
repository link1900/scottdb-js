import { Decimal } from "decimal.js";

export interface UnitDefinition<UnitType> {
  type: UnitType;
  code: string;
  name: string;
  toAnchor: Decimal;
}

export interface UnitScale<UnitType> {
  name: string;
  units: UnitDefinition<UnitType>[];
  anchor: UnitType;
}
