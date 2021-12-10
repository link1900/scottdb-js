import {
  parse as xmlParser,
  j2xParser as JsonToXmlParser,
  J2xOptionsOptional,
  X2jOptionsOptional,
} from "fast-xml-parser";

export interface ParseXmlToJsonOptions extends X2jOptionsOptional {
  applyValidation?: boolean;
}

export interface ParseJsonToXmlOptions extends J2xOptionsOptional {}

const defaultJsonParser = new JsonToXmlParser({ ignoreAttributes: false });

function getJsonToXmlParserForOptions(options?: ParseJsonToXmlOptions) {
  if (options !== undefined) {
    const parserOptions = {
      ignoreAttributes: false,
      ...options,
    };
    return new JsonToXmlParser(parserOptions);
  } else {
    return defaultJsonParser;
  }
}

export function parseXmlToJson(
  xmlString: string,
  options: ParseXmlToJsonOptions = {}
) {
  const { applyValidation = true, ...passedOptions } = options;
  const parseOptions: X2jOptionsOptional = {
    ignoreAttributes: false,
    parseAttributeValue: false,
    parseNodeValue: false,
    ...passedOptions,
  };
  return xmlParser(xmlString, parseOptions, applyValidation);
}

export function parseJsonToXml(
  jsonObject: object,
  options?: ParseJsonToXmlOptions
) {
  return getJsonToXmlParserForOptions(options).parse(jsonObject);
}
