#!/usr/bin/env ts-node

import { runScript } from "@link1900/node-script";
import { logger } from "@link1900/node-logger-api";
import csc, { ICountry, IState } from "country-state-city";
import { writeFileToDisk } from "@link1900/node-util";
import path from "path";
import slugify from "slugify";
import moment from "moment-timezone";

interface EnumDefinition {
  name: string;
  value: string;
}

async function main() {
  logger.info("running location enum type generator");
  await generateCountryEnum();
  await generateCountryCodeEnum();
  await generateAusStatesEnum();
  await generateAusStatesCodeEnum();
  await generateTimeZoneEnum();
}

function formatName(value: string): string {
  let preparedValue = value;
  if (/-\d/.test(value)) {
    preparedValue = preparedValue.replace(/-/g, "_MINUS_");
  }
  preparedValue = preparedValue.replace(/\+/g, "_PLUS_").replace(/[/-]/g, "_");
  return slugify(preparedValue, {
    replacement: "_",
    remove: /[,'().]/g,
  }).toUpperCase();
}

function formatValue(value: string): string {
  return value.replace(/[']/g, "");
}

async function generateCountryEnum() {
  const definitions = csc.getAllCountries().map((country: ICountry) => {
    const countryName = formatName(country.name);
    return { name: countryName, value: formatValue(country.name) };
  });

  await enumFileWriter("Country", definitions);
}

async function generateCountryCodeEnum() {
  const definitions = csc.getAllCountries().map((country: ICountry) => {
    const countryCode = formatName(country.isoCode);
    return { name: countryCode, value: countryCode };
  });

  await enumFileWriter("CountryCode", definitions);
}

async function generateAusStatesEnum() {
  const definitions = csc.getStatesOfCountry("AU").map((state: IState) => {
    const name = formatName(state.name);
    return { name, value: state.name };
  });

  await enumFileWriter("AustralianState", definitions);
}

async function generateAusStatesCodeEnum() {
  const definitions = csc.getStatesOfCountry("AU").map((state: IState) => {
    return { name: state.isoCode, value: state.isoCode };
  });

  await enumFileWriter("AustralianStateCode", definitions);
}

async function generateTimeZoneEnum() {
  const definitions = moment.tz.names().map((name: string) => {
    return { name: formatName(name), value: name };
  });
  definitions.push({ name: "AEST", value: "Etc/GMT-10" });
  definitions.push({ name: "AEDT", value: "Etc/GMT-11" });
  definitions.push({ name: "AWST", value: "Etc/GMT-8" });
  await enumFileWriter("Timezone", definitions);
}

async function enumFileWriter(
  enumName: string,
  enumDefinitions: EnumDefinition[]
) {
  const values = enumDefinitions.map((definition) => {
    return `${definition.name} = "${definition.value}"`;
  });

  const valueSet = [...new Set(values)].sort();
  const valueString = valueSet.join(",\n  ");

  const enumTemplate = `export enum ${enumName} {
  ${valueString},
}
`;

  await writeFileToDisk(
    path.join(__dirname, "..", "src", `${enumName}.ts`),
    enumTemplate
  );
}

runScript(main);
