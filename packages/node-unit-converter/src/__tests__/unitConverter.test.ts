import { CurrencyUnit } from "../units/CurrencyUnit";
import {
  convertCurrency,
  convertCurrencyDecimal,
  convertEnergy,
  convertEnergyDecimal,
  convertTime,
  convertTimeDecimal,
  convertVolume,
  convertVolumeDecimal,
} from "../unitConverter";
import { Decimal } from "decimal.js";
import { EnergyUnit } from "../units/EnergyUnit";
import { VolumeUnit } from "../units/VolumeUnit";
import { TimeUnit } from "../units/TimeUnit";

describe("convertCurrencyDecimal()", () => {
  const tests = [
    {
      input: 1,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 100,
    },
    {
      input: 100,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.DOLLAR,
      expected: 1,
    },
    {
      input: 87.33,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 8733,
    },
    {
      input: 158.83,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 15883,
    },
    {
      input: 15883,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.DOLLAR,
      expected: 158.83,
    },
    {
      input: 100,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.CENT,
      expected: 100,
    },
    {
      input: 0.33,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 33,
    },
    {
      input: 1,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.DOLLAR,
      expected: 0.01,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(
        convertCurrencyDecimal(new Decimal(input), from, to).toNumber()
      ).toEqual(expected);
    });
  });
});

describe("convertCurrency()", () => {
  const tests = [
    {
      input: 1,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 100,
    },
    {
      input: 100,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.DOLLAR,
      expected: 1,
    },
    {
      input: 87.33,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 8733,
    },
    {
      input: 158.83,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 15883,
    },
    {
      input: 15883,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.DOLLAR,
      expected: 158.83,
    },
    {
      input: 100,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.CENT,
      expected: 100,
    },
    {
      input: 0.33,
      from: CurrencyUnit.DOLLAR,
      to: CurrencyUnit.CENT,
      expected: 33,
    },
    {
      input: 1,
      from: CurrencyUnit.CENT,
      to: CurrencyUnit.DOLLAR,
      expected: 0.01,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(convertCurrency(input, from, to)).toEqual(expected);
    });
  });
});

describe("convertEnergyDecimal()", () => {
  const tests = [
    {
      input: 1000,
      from: EnergyUnit.JOULE,
      to: EnergyUnit.KILOJOULE,
      expected: 1,
    },
    {
      input: 1000000,
      from: EnergyUnit.JOULE,
      to: EnergyUnit.MEGAJOULE,
      expected: 1,
    },
    {
      input: 1000000000,
      from: EnergyUnit.JOULE,
      to: EnergyUnit.GIGAJOULE,
      expected: 1,
    },
    {
      input: 1,
      from: EnergyUnit.KILOJOULE,
      to: EnergyUnit.JOULE,
      expected: 1000,
    },
    {
      input: 1,
      from: EnergyUnit.MEGAJOULE,
      to: EnergyUnit.JOULE,
      expected: 1000000,
    },
    {
      input: 1,
      from: EnergyUnit.GIGAJOULE,
      to: EnergyUnit.JOULE,
      expected: 1000000000,
    },
    {
      input: 55,
      from: EnergyUnit.MEGAJOULE,
      to: EnergyUnit.KILOJOULE,
      expected: 55000,
    },
    {
      input: 5000,
      from: EnergyUnit.KILOJOULE,
      to: EnergyUnit.MEGAJOULE,
      expected: 5,
    },
    {
      input: 1000,
      from: EnergyUnit.WATT,
      to: EnergyUnit.KILOWATT,
      expected: 1,
    },
    {
      input: 1000000,
      from: EnergyUnit.WATT,
      to: EnergyUnit.MEGAWATT,
      expected: 1,
    },
    {
      input: 100,
      from: EnergyUnit.WATT,
      to: EnergyUnit.JOULE,
      expected: 100,
    },
    {
      input: 100,
      from: EnergyUnit.WATT,
      to: EnergyUnit.JOULE,
      expected: 100,
    },
    {
      input: 5000,
      from: EnergyUnit.WATT,
      to: EnergyUnit.WATT_HOUR,
      expected: 1.39,
    },
    {
      input: 1000,
      from: EnergyUnit.WATT_HOUR,
      to: EnergyUnit.KILOWATT_HOUR,
      expected: 1,
    },
    {
      input: 1000000,
      from: EnergyUnit.WATT_HOUR,
      to: EnergyUnit.MEGAWATT_HOUR,
      expected: 1,
    },
    {
      input: 183.5,
      from: EnergyUnit.KILOWATT_HOUR,
      to: EnergyUnit.WATT_HOUR,
      expected: 183500,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(
        convertEnergyDecimal(new Decimal(input), from, to)
          .toDecimalPlaces(2)
          .toNumber()
      ).toEqual(expected);
    });
  });
});

describe("convertEnergy()", () => {
  const tests = [
    {
      input: 1000,
      from: EnergyUnit.JOULE,
      to: EnergyUnit.KILOJOULE,
      expected: 1,
    },
    {
      input: 1000000,
      from: EnergyUnit.JOULE,
      to: EnergyUnit.MEGAJOULE,
      expected: 1,
    },
    {
      input: 1000000000,
      from: EnergyUnit.JOULE,
      to: EnergyUnit.GIGAJOULE,
      expected: 1,
    },
    {
      input: 1,
      from: EnergyUnit.KILOJOULE,
      to: EnergyUnit.JOULE,
      expected: 1000,
    },
    {
      input: 1,
      from: EnergyUnit.MEGAJOULE,
      to: EnergyUnit.JOULE,
      expected: 1000000,
    },
    {
      input: 1,
      from: EnergyUnit.GIGAJOULE,
      to: EnergyUnit.JOULE,
      expected: 1000000000,
    },
    {
      input: 55,
      from: EnergyUnit.MEGAJOULE,
      to: EnergyUnit.KILOJOULE,
      expected: 55000,
    },
    {
      input: 5000,
      from: EnergyUnit.KILOJOULE,
      to: EnergyUnit.MEGAJOULE,
      expected: 5,
    },
    {
      input: 1000,
      from: EnergyUnit.WATT,
      to: EnergyUnit.KILOWATT,
      expected: 1,
    },
    {
      input: 1000000,
      from: EnergyUnit.WATT,
      to: EnergyUnit.MEGAWATT,
      expected: 1,
    },
    {
      input: 100,
      from: EnergyUnit.WATT,
      to: EnergyUnit.JOULE,
      expected: 100,
    },
    {
      input: 100,
      from: EnergyUnit.WATT,
      to: EnergyUnit.JOULE,
      expected: 100,
    },
    {
      input: 5000,
      from: EnergyUnit.WATT,
      to: EnergyUnit.WATT_HOUR,
      expected: 1.3888888888888888,
    },
    {
      input: 1000,
      from: EnergyUnit.WATT_HOUR,
      to: EnergyUnit.KILOWATT_HOUR,
      expected: 1,
    },
    {
      input: 1000000,
      from: EnergyUnit.WATT_HOUR,
      to: EnergyUnit.MEGAWATT_HOUR,
      expected: 1,
    },
    {
      input: 183.5,
      from: EnergyUnit.KILOWATT_HOUR,
      to: EnergyUnit.WATT_HOUR,
      expected: 183500,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(convertEnergy(input, from, to)).toEqual(expected);
    });
  });
});

describe("convertVolumeDecimal()", () => {
  const tests = [
    {
      input: 1,
      from: VolumeUnit.KILO_LITRE,
      to: VolumeUnit.LITRE,
      expected: 1000,
    },
    {
      input: 1,
      from: VolumeUnit.MEGA_LITRE,
      to: VolumeUnit.LITRE,
      expected: 1000000,
    },
    {
      input: 1,
      from: VolumeUnit.MEGA_LITRE,
      to: VolumeUnit.KILO_LITRE,
      expected: 1000,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(
        convertVolumeDecimal(new Decimal(input), from, to).toNumber()
      ).toEqual(expected);
    });
  });
});

describe("convertVolume()", () => {
  const tests = [
    {
      input: 1,
      from: VolumeUnit.KILO_LITRE,
      to: VolumeUnit.LITRE,
      expected: 1000,
    },
    {
      input: 1,
      from: VolumeUnit.MEGA_LITRE,
      to: VolumeUnit.LITRE,
      expected: 1000000,
    },
    {
      input: 1,
      from: VolumeUnit.MEGA_LITRE,
      to: VolumeUnit.KILO_LITRE,
      expected: 1000,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(convertVolume(input, from, to)).toEqual(expected);
    });
  });
});

describe("convertTimeDecimal()", () => {
  const tests = [
    {
      input: 5000000000,
      from: TimeUnit.NANOSECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 5000000,
      from: TimeUnit.MICROSECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 5000,
      from: TimeUnit.MILLISECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 5,
      from: TimeUnit.SECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 300,
      from: TimeUnit.SECOND,
      to: TimeUnit.MINUTE,
      expected: 5,
    },
    {
      input: 18000,
      from: TimeUnit.SECOND,
      to: TimeUnit.HOUR,
      expected: 5,
    },
    {
      input: 2,
      from: TimeUnit.DAY,
      to: TimeUnit.HOUR,
      expected: 48,
    },
    {
      input: 1,
      from: TimeUnit.WEEK,
      to: TimeUnit.HOUR,
      expected: 168,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(
        convertTimeDecimal(new Decimal(input), from, to).toNumber()
      ).toEqual(expected);
    });
  });
});

describe("convertTime()", () => {
  const tests = [
    {
      input: 5000000000,
      from: TimeUnit.NANOSECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 5000000,
      from: TimeUnit.MICROSECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 5000,
      from: TimeUnit.MILLISECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 5,
      from: TimeUnit.SECOND,
      to: TimeUnit.SECOND,
      expected: 5,
    },
    {
      input: 300,
      from: TimeUnit.SECOND,
      to: TimeUnit.MINUTE,
      expected: 5,
    },
    {
      input: 18000,
      from: TimeUnit.SECOND,
      to: TimeUnit.HOUR,
      expected: 5,
    },
    {
      input: 2,
      from: TimeUnit.DAY,
      to: TimeUnit.HOUR,
      expected: 48,
    },
    {
      input: 1,
      from: TimeUnit.WEEK,
      to: TimeUnit.HOUR,
      expected: 168,
    },
  ];
  tests.forEach(({ input, from, to, expected }) => {
    it(`convert ${input} ${from.toString()} to ${to.toString()} gets ${expected}`, () => {
      expect(convertTime(input, from, to)).toEqual(expected);
    });
  });
});
