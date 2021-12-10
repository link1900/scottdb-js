import { Decimal } from "decimal.js";
import { UnitScale } from "../UnitScale";

export enum VolumeUnit {
  LITRE = "LITRE",
  KILO_LITRE = "KILO_LITRE",
  MEGA_LITRE = "MEGA_LITRE",
}

export const VOLUME_SCALE: UnitScale<VolumeUnit> = {
  name: "volume",
  units: [
    {
      type: VolumeUnit.LITRE,
      code: "L",
      name: "Litre",
      toAnchor: new Decimal(1),
    },
    {
      type: VolumeUnit.KILO_LITRE,
      code: "KL",
      name: "Litre",
      toAnchor: new Decimal(1000),
    },
    {
      type: VolumeUnit.MEGA_LITRE,
      code: "ML",
      name: "Litre",
      toAnchor: new Decimal(1000000),
    },
  ],
  anchor: VolumeUnit.LITRE,
};
