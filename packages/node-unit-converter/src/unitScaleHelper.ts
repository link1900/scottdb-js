import Decimal from "decimal.js";
import { UnitScale } from "./UnitScale";

export function findUnitDefinitionForScale<UnitType>(
  unitScale: UnitScale<UnitType>,
  target: UnitType
) {
  return unitScale.units.find(
    (unitDefinition) => unitDefinition.type === target
  );
}

export function convertDecimalUnitForScale<UnitType>(
  value: Decimal,
  from: UnitType,
  to: UnitType,
  unitScale: UnitScale<UnitType>
): Decimal {
  if (from === to) {
    return value;
  }
  const fromDefinition = findUnitDefinitionForScale(unitScale, from);
  const toDefinition = findUnitDefinitionForScale(unitScale, to);
  if (fromDefinition === undefined || toDefinition === undefined) {
    throw new Error("Conversion failed. No definition found for unit.");
  }
  return value.times(fromDefinition.toAnchor).dividedBy(toDefinition.toAnchor);
}

export function convertNumberUnitForScale<UnitType>(
  numberValue: number,
  from: UnitType,
  to: UnitType,
  unitScale: UnitScale<UnitType>
): number {
  return convertDecimalUnitForScale(
    new Decimal(numberValue),
    from,
    to,
    unitScale
  ).toNumber();
}

export function getUnitForCodeInScale<UnitType>(
  code: string,
  unitScale: UnitScale<UnitType>
): UnitType | undefined {
  const found = unitScale.units.find((unit) => unit.code === code);
  if (!found) {
    return undefined;
  }
  return found.type;
}
