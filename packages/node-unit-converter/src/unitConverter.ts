import Decimal from "decimal.js";
import { CURRENCY_SCALE, CurrencyUnit } from "./units/CurrencyUnit";
import { ENERGY_SCALE, EnergyUnit } from "./units/EnergyUnit";
import { VOLUME_SCALE, VolumeUnit } from "./units/VolumeUnit";
import { TIME_SCALE, TimeUnit } from "./units/TimeUnit";
import {
  convertDecimalUnitForScale,
  convertNumberUnitForScale,
} from "./unitScaleHelper";

export function convertCurrency(
  value: number,
  from: CurrencyUnit,
  to: CurrencyUnit
): number {
  return convertNumberUnitForScale(value, from, to, CURRENCY_SCALE);
}

export function convertCurrencyDecimal(
  value: Decimal,
  from: CurrencyUnit,
  to: CurrencyUnit
): Decimal {
  return convertDecimalUnitForScale(value, from, to, CURRENCY_SCALE);
}

export function convertEnergy(
  value: number,
  from: EnergyUnit,
  to: EnergyUnit
): number {
  return convertNumberUnitForScale(value, from, to, ENERGY_SCALE);
}

export function convertEnergyDecimal(
  value: Decimal,
  from: EnergyUnit,
  to: EnergyUnit
): Decimal {
  return convertDecimalUnitForScale(value, from, to, ENERGY_SCALE);
}

export function convertVolume(
  value: number,
  from: VolumeUnit,
  to: VolumeUnit
): number {
  return convertNumberUnitForScale(value, from, to, VOLUME_SCALE);
}

export function convertVolumeDecimal(
  value: Decimal,
  from: VolumeUnit,
  to: VolumeUnit
): Decimal {
  return convertDecimalUnitForScale(value, from, to, VOLUME_SCALE);
}

export function convertTime(
  value: number,
  from: TimeUnit,
  to: TimeUnit
): number {
  return convertNumberUnitForScale(value, from, to, TIME_SCALE);
}

export function convertTimeDecimal(
  value: Decimal,
  from: TimeUnit,
  to: TimeUnit
): Decimal {
  return convertDecimalUnitForScale(value, from, to, TIME_SCALE);
}
