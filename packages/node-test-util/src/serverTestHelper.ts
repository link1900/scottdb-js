import assert from "assert";
import { Express } from "express";
import supertest from "supertest";

export interface ApiOptions {
  url: string;
  body?: object;
  authToken?: string;
  expectNetworkErrors?: boolean;
  headers?: { name: string; value: string }[];
  cookies?: { name: string; value: string }[];
  timeout?: number;
}

export type TestServiceProvider = () => Promise<Express>;

let testServer: Express | undefined;
let testServerProvider: TestServiceProvider | undefined;

export function setTestServerProvider(serverProvider: () => Promise<Express>) {
  testServerProvider = serverProvider;
}

export async function getTestServer() {
  if (!testServer) {
    if (!testServerProvider) {
      throw new Error(
        "No test server provider found. Call setTestServerProvider before running tests."
      );
    }
    testServer = await testServerProvider();
  }
  return testServer;
}

export function checkForError(response: any, expectError: boolean) {
  const hasNetworkError = response.status < 200 || response.status > 399;
  if (expectError) {
    assert(
      hasNetworkError,
      `Server should not return 200 response but did. Result: ${JSON.stringify(
        response?.body
      )}.`
    );
  } else {
    assert(
      !hasNetworkError,
      `Server should not return errors but errors were detected. \nResponseCode: ${
        response.status
      } \nResult: ${JSON.stringify(response.body, null, 2)} \nErrors: ${
        response.error
      }`
    );
  }
}

export async function callGetEndpoint(options: ApiOptions) {
  const {
    url,
    expectNetworkErrors = false,
    cookies,
    headers,
    timeout,
  } = options;
  const call = supertest(await getTestServer()).get(url);

  if (cookies) {
    const cookieString: string = cookies
      .map((c) => `${c.name}=${c.value}`)
      .join(";");
    call.set("Cookie", [cookieString]);
  }

  if (headers) {
    headers.forEach((header) => {
      call.set(header.name, header.value);
    });
  }

  if (timeout !== undefined) {
    call.timeout(timeout);
  }

  const response = await call.send();
  checkForError(response, expectNetworkErrors);
  return response;
}

export async function callOptionsEndpoint(options: ApiOptions) {
  const { url, expectNetworkErrors = false } = options;
  const call = supertest(await getTestServer()).options(url);
  const response = await call.send();
  checkForError(response, expectNetworkErrors);
  return response;
}

export async function callDeleteEndpoint(options: ApiOptions) {
  const { url, expectNetworkErrors = false } = options;
  const response = await supertest(await getTestServer()).delete(url);
  checkForError(response, expectNetworkErrors);
  return response;
}

export async function callPostEndpoint(options: ApiOptions) {
  const {
    url,
    expectNetworkErrors = false,
    body = {},
    authToken,
    cookies,
    headers,
    timeout,
  } = options;
  const call = supertest(await getTestServer())
    .post(url)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json");

  if (cookies) {
    const cookieString: string = cookies
      .map((c) => `${c.name}=${c.value}`)
      .join(";");
    call.set("Cookie", [cookieString]);
  }

  if (authToken) {
    call.set("Authorization", `Bearer ${authToken}`);
  }

  if (headers) {
    headers.forEach((header) => {
      call.set(header.name, header.value);
    });
  }

  if (timeout !== undefined) {
    call.timeout(timeout);
  }

  const response = await call.send(body);
  checkForError(response, expectNetworkErrors);
  return response;
}
