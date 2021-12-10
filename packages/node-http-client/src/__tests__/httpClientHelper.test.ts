import {
  addCookiesToRequestHeaders,
  getCookiesFromResponse,
  getCookieString,
  getSetCookieStrings,
  makeRequest,
  makeValidHtmlRequest,
  makeValidJsonRequest,
  makeValidRequest,
  makeValidXmlRequest,
} from "../httpClientHelper";
import { mockApi, MockApiOptions } from "@link1900/node-test-util";
import { Cookie } from "tough-cookie";
import { isPresent } from "@link1900/node-util";

export type ExampleResponse = {
  result?: string;
};

export function mockBasicApiCall(options?: Partial<MockApiOptions>) {
  return mockApi({
    baseUrl: "http://localhost",
    path: "/example",
    method: "GET",
    status: 200,
    body: { result: "success" },
    ...options,
  });
}

const EXAMPLE_URL = "http://localhost/example";

describe("httpClientHelper", () => {
  describe("makeRequest()", () => {
    it("return a successful response for get call", async () => {
      const apiMock = mockBasicApiCall();
      const response = await makeRequest(EXAMPLE_URL);
      const body = await response.json();
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual("OK");
      expect(body.result).toEqual("success");
      expect(apiMock.isDone()).toEqual(true);
    });

    it("return a successful response for post call", async () => {
      const apiMock = mockBasicApiCall({ method: "POST" });
      const exampleBody = "somebody";
      const exampleHeaders = { "Content-Type": "application/text" };
      const response = await makeRequest(EXAMPLE_URL, {
        method: "POST",
        body: exampleBody,
        headers: exampleHeaders,
      });
      const body = await response.json();
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual("OK");
      expect(body.result).toEqual("success");
      expect(apiMock.isDone()).toEqual(true);
      expect(apiMock.requestBody).toEqual(exampleBody);
      expect(apiMock.requestHeaders).toMatchObject({
        "content-type": ["application/text"],
      });
    });

    it("return a error response on api error", async () => {
      const apiMock = mockBasicApiCall({
        path: "/",
        status: 404,
        body: {
          result: "failed",
        },
      });

      const response = await makeRequest("http://localhost/");
      const body = await response.json();
      expect(response.status).toEqual(404);
      expect(response.ok).toEqual(false);
      expect(response.statusText).toEqual("Not Found");
      expect(body.result).toEqual("failed");
      expect(apiMock.isDone()).toEqual(true);
    });
  });

  describe("makeValidRequest()", () => {
    it("return a successful response for get call", async () => {
      const apiMock = mockBasicApiCall({ path: "/" });
      const response = await makeValidRequest({ url: "http://localhost/" });
      const body = await response.json();
      expect(response.status).toEqual(200);
      expect(response.statusText).toEqual("OK");
      expect(body.result).toEqual("success");
      expect(apiMock.isDone()).toEqual(true);
    });

    it("throws error on api error", async () => {
      const apiMock = mockBasicApiCall({
        path: "/",
        status: 404,
        body: {
          result: "failed",
        },
      });

      try {
        await makeValidRequest({ url: "http://localhost/" });
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.code).toEqual("EXTERNAL_API_ERROR");
        expect(error.httpCode).toEqual(500);
        expect(error.externalHttpCode).toEqual(404);
        expect(error.message).toEqual(
          'Error calling external api. http status code: 404 body: {"result":"failed"}'
        );
      }
      expect(apiMock.isDone()).toEqual(true);
    });
  });

  describe("makeValidJsonRequest()", () => {
    it("returns success for a valid call", async () => {
      const apiMock = mockBasicApiCall({ path: "/" });
      const response = await makeValidJsonRequest<ExampleResponse>({
        url: "http://localhost/",
      });
      expect(response.result).toEqual("success");
      expect(apiMock.isDone()).toEqual(true);
    });

    it("returns empty object for a no content response", async () => {
      const apiMock = mockBasicApiCall({ body: null, status: 204 });
      const response = await makeValidJsonRequest<ExampleResponse>({
        url: EXAMPLE_URL,
      });
      expect(response).toEqual({});
      expect(apiMock.isDone()).toEqual(true);
    });

    it("returns success for a valid post call", async () => {
      const apiMock = mockBasicApiCall({ method: "POST" });
      const exampleBody = { input: "car" };
      const response = await makeValidJsonRequest<{ result: string }>({
        url: EXAMPLE_URL,
        method: "POST",
        body: exampleBody,
      });
      expect(response.result).toEqual("success");
      expect(apiMock.isDone()).toEqual(true);
      expect(apiMock.requestBody).toEqual(exampleBody);
    });

    it("returns success for a valid post call without bodies", async () => {
      const apiMock = mockBasicApiCall({ method: "POST", body: null });
      const response = await makeValidJsonRequest({
        url: EXAMPLE_URL,
        method: "POST",
      });
      expect(response).toEqual(null);
      expect(apiMock.isDone()).toEqual(true);
    });

    it("throws error for invalid json response", async () => {
      const apiMock = mockBasicApiCall({ path: "/", body: "not json" });

      try {
        await makeValidJsonRequest({ url: "http://localhost/" });
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.code).toEqual("EXTERNAL_API_ERROR");
        expect(error.httpCode).toEqual(500);
        expect(error.message).toEqual(
          "Error reading external api response. Expected response body to be json but failed to parse. Original Error: invalid json response body at http://localhost/ reason: Unexpected token o in JSON at position 1"
        );
      }

      expect(apiMock.isDone()).toEqual(true);
    });

    it("throws error for an error response", async () => {
      const apiMock = mockBasicApiCall({
        path: "/",
        status: 404,
        body: {
          result: "failed",
        },
      });

      try {
        await makeValidJsonRequest({ url: "http://localhost/" });
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.code).toEqual("EXTERNAL_API_ERROR");
      }

      expect(apiMock.isDone()).toEqual(true);
    });

    it("throws error for an network error", async () => {
      const apiMock = mockBasicApiCall({
        path: "/",
        networkErrorMessage: "Error",
      });

      try {
        await makeValidJsonRequest({ url: "http://localhost/" });
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.code).toEqual("EXTERNAL_API_ERROR");
        expect(error.message).toEqual(
          "Error calling external api. Original Error: request to http://localhost/ failed, reason: Error"
        );
      }

      expect(apiMock.isDone()).toEqual(true);
    });
  });

  describe("makeValidHtmlRequest()", () => {
    it("returns success for a valid call", async () => {
      const exampleBody = '<html lang="en"></html>';
      const apiMock = mockBasicApiCall({ body: exampleBody });
      const response = await makeValidHtmlRequest({ url: EXAMPLE_URL });
      expect(response).toEqual(exampleBody);
      expect(apiMock.isDone()).toEqual(true);
    });

    it("returns empty string for a no content response", async () => {
      const apiMock = mockBasicApiCall({ body: null, status: 204 });
      const response = await makeValidHtmlRequest({
        url: EXAMPLE_URL,
      });
      expect(response).toEqual("");
      expect(apiMock.isDone()).toEqual(true);
    });
  });

  describe("makeValidXmlRequest()", () => {
    it("returns success for a valid call", async () => {
      const apiMock = mockBasicApiCall({
        body: `<?xml version="1.0"?>
            <body name="John">
              <arm>
                <hand>left</hand>
              </arm>
              <foot/>
            </body>
        `,
      });
      const response = await makeValidXmlRequest({ url: EXAMPLE_URL });
      expect(response).toEqual({
        body: {
          "@_name": "John",
          arm: {
            hand: "left",
          },
          foot: "",
        },
      });
      expect(apiMock.isDone()).toEqual(true);
    });

    it("returns empty body for no content response", async () => {
      const apiMock = mockBasicApiCall({
        status: 204,
        body: null,
      });
      const response = await makeValidXmlRequest({ url: EXAMPLE_URL });
      expect(response).toEqual({});
      expect(apiMock.isDone()).toEqual(true);
    });

    it("returns success for xml request with body", async () => {
      const apiMock = mockBasicApiCall({
        method: "POST",
        body: `<?xml version="1.0"?>
            <body name="John">
              <arm>
                <hand>left</hand>
              </arm>
              <foot/>
            </body>
        `,
      });
      const exampleBody = { input: "body" };
      const response = await makeValidXmlRequest({
        url: EXAMPLE_URL,
        method: "POST",
        body: exampleBody,
      });
      expect(response).toEqual({
        body: {
          "@_name": "John",
          arm: {
            hand: "left",
          },
          foot: "",
        },
      });
      expect(apiMock.isDone()).toEqual(true);
      expect(apiMock.requestBody).toEqual("<input>body</input>");
    });

    it("throws error for xml parse failure", async () => {
      const apiMock = mockBasicApiCall({ body: `what is xml?` });

      try {
        await makeValidXmlRequest({ url: EXAMPLE_URL });
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual(
          "Error calling external api. Expected body to be xml but failed to parse. Original Error: char 'w' is not expected."
        );
      }

      expect(apiMock.isDone()).toEqual(true);
    });
  });
});

describe("getCookiesFromResponse()", () => {
  it("returns a cookie", async () => {
    const apiMock = mockBasicApiCall({
      headers: {
        "set-cookie": [
          "key1=value1; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure",
        ],
      },
    });
    const response = await makeRequest(EXAMPLE_URL);
    const results = getCookiesFromResponse(response);
    expect(results).toHaveLength(1);
    const cookieResult = results[0];
    expect(cookieResult.key).toEqual("key1");
    expect(cookieResult.value).toEqual("value1");
    expect(cookieResult.path).toEqual("/");
    expect(cookieResult.sameSite).toEqual("none");
    expect(cookieResult.secure).toEqual(true);
    expect(apiMock.isDone()).toEqual(true);
  });

  it("returns empty array when there are no cookie headers", async () => {
    const apiMock = mockBasicApiCall();
    const response = await makeRequest(EXAMPLE_URL);
    const results = getCookiesFromResponse(response);
    expect(results).toHaveLength(0);
    expect(apiMock.isDone()).toEqual(true);
  });

  it("returns empty array when cookie headers are invalid", async () => {
    const apiMock = mockBasicApiCall({
      headers: {
        "set-cookie": ["bad"],
      },
    });
    const response = await makeRequest(EXAMPLE_URL);
    const results = getCookiesFromResponse(response);
    expect(results).toHaveLength(0);
    expect(apiMock.isDone()).toEqual(true);
  });

  it("returns multiple cookies", async () => {
    const apiMock = mockBasicApiCall({
      headers: {
        "set-cookie": ["key1=value1; path=/", "key2=value2; path=/"],
      },
    });
    const response = await makeRequest(EXAMPLE_URL);
    const results = getCookiesFromResponse(response);
    expect(results).toHaveLength(2);
    expect(apiMock.isDone()).toEqual(true);
  });
});

describe("getCookieString()", () => {
  it("returns a cookie string", async () => {
    const cookies = [
      Cookie.parse(
        "key1=value1; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure"
      ),
    ].filter(isPresent);
    const result = getCookieString(cookies);
    expect(result).toEqual("key1=value1");
  });

  it("returns a empty cookie string", async () => {
    const cookies: Cookie[] = [];
    const result = getCookieString(cookies);
    expect(result).toEqual("");
  });

  it("returns a cookie string for multiple cookies", async () => {
    const cookies = [
      Cookie.parse(
        "key1=value1; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure"
      ),
      Cookie.parse(
        "key2=value2; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure"
      ),
    ].filter(isPresent);
    const result = getCookieString(cookies);
    expect(result).toEqual("key1=value1; key2=value2");
  });
});

describe("addCookiesToRequestHeaders()", () => {
  it("adds cookie header", async () => {
    const cookies = [
      Cookie.parse(
        "key1=value1; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure"
      ),
    ].filter(isPresent);
    const result = addCookiesToRequestHeaders({}, cookies);
    expect(result).toEqual({ Cookie: "key1=value1" });
  });
});

describe("getSetCookieStrings()", () => {
  it("returns a set cookie string", async () => {
    const cookies = [
      Cookie.parse(
        "key1=value1; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure"
      ),
    ].filter(isPresent);
    const result = getSetCookieStrings(cookies);
    expect(result).toEqual([
      "key1=value1; Expires=Thu, 04 Nov 2021 02:44:20 GMT; Path=/; Secure",
    ]);
  });

  it("returns multiple a set cookie strings", async () => {
    const cookies = [
      Cookie.parse(
        "key1=value1; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure"
      ),
      Cookie.parse(
        "key2=value2; path=/; Expires=Thu, 04 Nov 2021 02:44:20 GMT; SameSite=None; Secure"
      ),
    ].filter(isPresent);
    const result = getSetCookieStrings(cookies);
    expect(result).toEqual([
      "key1=value1; Expires=Thu, 04 Nov 2021 02:44:20 GMT; Path=/; Secure",
      "key2=value2; Expires=Thu, 04 Nov 2021 02:44:20 GMT; Path=/; Secure",
    ]);
  });
});
