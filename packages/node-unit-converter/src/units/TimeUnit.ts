import { Decimal } from "decimal.js";
import { UnitScale } from "../UnitScale";

export enum TimeUnit {
  NANOSECOND = "NANOSECOND",
  MICROSECOND = "MICROSECOND",
  MILLISECOND = "MILLISECOND",
  SECOND = "SECOND",
  MINUTE = "MINUTE",
  HOUR = "HOUR",
  DAY = "DAY",
  WEEK = "WEEK",
}

export const TIME_SCALE: UnitScale<TimeUnit> = {
  name: "time",
  units: [
    {
      type: TimeUnit.NANOSECOND,
      code: "ns",
      name: "nanosecond",
      toAnchor: new Decimal(1).dividedBy(1000000000),
    },
    {
      type: TimeUnit.MICROSECOND,
      code: "mu",
      name: "microsecond",
      toAnchor: new Decimal(1).dividedBy(1000000),
    },
    {
      type: TimeUnit.MILLISECOND,
      code: "ms",
      name: "millisecond",
      toAnchor: new Decimal(1).dividedBy(1000),
    },
    {
      type: TimeUnit.SECOND,
      code: "s",
      name: "second",
      toAnchor: new Decimal(1),
    },
    {
      type: TimeUnit.MINUTE,
      code: "min",
      name: "minute",
      toAnchor: new Decimal(60),
    },
    {
      type: TimeUnit.HOUR,
      code: "h",
      name: "hour",
      toAnchor: new Decimal(60).times(60),
    },
    {
      type: TimeUnit.DAY,
      code: "d",
      name: "day",
      toAnchor: new Decimal(60).times(60).times(24),
    },
    {
      type: TimeUnit.WEEK,
      code: "week",
      name: "week",
      toAnchor: new Decimal(60).times(60).times(24).times(7),
    },
  ],
  anchor: TimeUnit.SECOND,
};
