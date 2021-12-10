import fetch, { RequestInit, Response } from "node-fetch";
import { Cookie, CookieJar } from "tough-cookie";
import { HttpVerb } from "@link1900/node-error";
import {
  getBenchmarkStartTime,
  getBenchmarkEndTimeMilliseconds,
  isPresent,
} from "@link1900/node-util";
import { logger } from "@link1900/node-logger";
import { ExternalApiError } from "./ExternalApiError";
import {
  parseJsonToXml,
  ParseJsonToXmlOptions,
  parseXmlToJson,
  ParseXmlToJsonOptions,
} from "./xmlHelper";

export { Cookie, CookieJar };

export interface ValidRequestOptions extends RequestInit {
  url: string;
}

export interface ValidJsonRequestOptions
  extends Omit<RequestInit, "body" | "headers"> {
  url: string;
  body?: object;
  headers?: { [key: string]: string };
}

export interface ValidXmlRequestOptions
  extends Omit<RequestInit, "body" | "headers"> {
  url: string;
  body?: object;
  headers?: { [key: string]: string };
  requestBodyParserOptions?: ParseJsonToXmlOptions;
  responseBodyParserOptions?: ParseXmlToJsonOptions;
}

export async function makeRequest(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    const startRequestMark = getBenchmarkStartTime();
    const method = options?.method ?? HttpVerb.GET;
    logger.info(`Making external request to [${method}][${url}]`);
    logger.debug(`Making external request to ${url} with options`, {
      requestOptions: options,
    });
    const apiResponse = await fetch(url, options);
    const endRequestMark = getBenchmarkEndTimeMilliseconds(startRequestMark);
    logger.info(
      `External api ${url} responded with [${apiResponse.status}] in [${endRequestMark}ms]`
    );
    logger.debug(`External api ${url} response`, {
      response: apiResponse,
    });
    return apiResponse;
  } catch (error) {
    const message = combineErrorMessages("Error calling external api", error);
    throw new ExternalApiError({ message, originalError: error });
  }
}

export async function makeValidRequest(
  options: ValidRequestOptions
): Promise<Response> {
  const { url, ...fetchOptions } = options;
  const apiResponse = await makeRequest(url, fetchOptions);

  if (apiResponse.ok) {
    return apiResponse;
  } else {
    const errorBodyText = await apiResponse.text();
    throw new ExternalApiError({
      message: `Error calling external api. http status code: ${apiResponse.status} body: ${errorBodyText}`,
      externalHttpCode: apiResponse.status,
      externalMessage: errorBodyText,
    });
  }
}

/**
 * Helper to make api requests to json endpoints that accept and respond in json.
 * @param options
 */
export async function makeValidJsonRequest<ResponseType>(
  options: ValidJsonRequestOptions
): Promise<ResponseType> {
  const { url, body: jsonBody, headers = {}, ...passedFetchOptions } = options;

  // force the headers to be json
  headers["Content-Type"] = "application/json";
  headers.Accept = "application/json";

  const fetchBody =
    jsonBody !== undefined ? JSON.stringify(jsonBody) : undefined;

  const fetchOptions = {
    url,
    body: fetchBody,
    headers,
    ...passedFetchOptions,
  };

  const response = await makeValidRequest(fetchOptions);

  if (response.status === 204) {
    // assume response type allows empty body for 204
    return {} as ResponseType;
  }

  try {
    return await response.json();
  } catch (error) {
    const message = combineErrorMessages(
      "Error reading external api response. Expected response body to be json but failed to parse",
      error
    );
    throw new ExternalApiError({
      message,
      originalError: error,
    });
  }
}

/**
 * Helper to make api requests to endpoints that return html
 * @param options
 */
export async function makeValidHtmlRequest(
  options: ValidRequestOptions
): Promise<string> {
  const { url, ...passedFetchOptions } = options;

  const fetchOptions = {
    url,
    ...passedFetchOptions,
  };
  const response = await makeValidRequest(fetchOptions);

  if (response.status === 204) {
    return "";
  }

  try {
    return await response.text();
  } catch (error) {
    const message = combineErrorMessages(
      "Error calling external api. Expected body to be text but failed to parse",
      error
    );
    throw new ExternalApiError({
      message,
      originalError: error,
    });
  }
}

/**
 * Helper to make api requests to endpoints that return xml.
 * Assumes the provided bodies are in xml and responses are xml.
 * This will handle xml parsing of both the request body and response body.
 * Xml parsing done by fast-xml-parser and its options can be passed through.
 * @param options
 */
export async function makeValidXmlRequest(
  options: ValidXmlRequestOptions
): Promise<string> {
  const {
    url,
    body: jsonBody,
    requestBodyParserOptions,
    responseBodyParserOptions,
    headers = {},
    ...passedFetchOptions
  } = options;

  // force the headers to be xml
  headers["Content-Type"] = "application/xml";
  headers.Accept = "application/xml";

  const fetchBody =
    jsonBody !== undefined
      ? parseJsonToXml(jsonBody, requestBodyParserOptions)
      : undefined;

  const fetchOptions = {
    url,
    body: fetchBody,
    headers,
    ...passedFetchOptions,
  };

  const response = await makeValidRequest(fetchOptions);

  if (response.status === 204) {
    // assume response type allows empty body for 204
    return {} as ResponseType;
  }

  try {
    const resultBodyText = await response.text();
    return parseXmlToJson(resultBodyText, responseBodyParserOptions);
  } catch (error) {
    const message = combineErrorMessages(
      "Error calling external api. Expected body to be xml but failed to parse",
      error
    );
    throw new ExternalApiError({
      message: message,
      originalError: error,
    });
  }
}

export function combineErrorMessages(message: string, error: Error): string {
  return error ? `${message}. Original Error: ${error?.message}` : message;
}

export function getCookiesFromResponse(response: Response): Cookie[] {
  const cookieStrings = response.headers.raw()["set-cookie"];
  return (
    cookieStrings
      ?.map((cookieString) => Cookie.parse(cookieString))
      .filter(isPresent) ?? []
  );
}

export function getCookieString(cookies: Array<Cookie>): string {
  return cookies.map((cookie: Cookie) => cookie.cookieString()).join("; ");
}

export function addCookiesToRequestHeaders(
  headers: Record<string, string>,
  cookies: Array<Cookie>
): Record<string, string> {
  headers["Cookie"] = getCookieString(cookies);
  return headers;
}

export function getSetCookieStrings(cookies: Array<Cookie>): string[] {
  return cookies.map((cookie: Cookie) => cookie.toString());
}
