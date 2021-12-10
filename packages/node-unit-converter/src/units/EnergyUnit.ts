import { Decimal } from "decimal.js";
import { UnitScale } from "../UnitScale";

export enum EnergyUnit {
  JOULE = "JOULE",
  KILOJOULE = "KILOJOULE",
  MEGAJOULE = "MEGAJOULE",
  GIGAJOULE = "GIGAJOULE",

  WATT = "WATT",
  KILOWATT = "KILOWATT",
  MEGAWATT = "MEGAWATT",

  WATT_HOUR = "WATT_HOUR",
  KILOWATT_HOUR = "KILOWATT_HOUR",
  MEGAWATT_HOUR = "MEGAWATT_HOUR",
}

export const ENERGY_SCALE: UnitScale<EnergyUnit> = {
  name: "energy",
  units: [
    {
      type: EnergyUnit.JOULE,
      code: "J",
      name: "Joule",
      toAnchor: new Decimal(1),
    },
    {
      type: EnergyUnit.KILOJOULE,
      code: "kJ",
      name: "Kilojoule",
      toAnchor: new Decimal(1000),
    },
    {
      type: EnergyUnit.MEGAJOULE,
      code: "MJ",
      name: "Megajoule",
      toAnchor: new Decimal(1000000),
    },
    {
      type: EnergyUnit.GIGAJOULE,
      code: "GJ",
      name: "Gigajoule",
      toAnchor: new Decimal(1000000000),
    },
    {
      type: EnergyUnit.WATT,
      code: "W",
      name: "Watt",
      toAnchor: new Decimal(1),
    },
    {
      type: EnergyUnit.KILOWATT,
      code: "kW",
      name: "Kilowatt",
      toAnchor: new Decimal(1000),
    },
    {
      type: EnergyUnit.MEGAWATT,
      code: "MW",
      name: "Megawatt",
      toAnchor: new Decimal(1000000),
    },
    {
      type: EnergyUnit.WATT_HOUR,
      code: "Wh",
      name: "Watt-hour",
      toAnchor: new Decimal(3600),
    },
    {
      type: EnergyUnit.KILOWATT_HOUR,
      code: "kWh",
      name: "Kilowatt-hour",
      toAnchor: new Decimal(3600000),
    },
    {
      type: EnergyUnit.MEGAWATT_HOUR,
      code: "MWh",
      name: "Megawatt-hour",
      toAnchor: new Decimal(3600000000),
    },
  ],
  anchor: EnergyUnit.JOULE,
};
