import fetch from "node-fetch";
import { mockApi, mockApiFunctionBuilder } from "../externalApiTestHelper";

const EXAMPLE_URL = "http://localhost/example";

describe("mockApi()", () => {
  it("mocks the api correctly", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "GET",
      status: 200,
      body: { result: "success" },
    });
    const response = await fetch(EXAMPLE_URL, { method: "GET" });
    const body = (await response.json()) as any;
    expect(response.status).toEqual(200);
    expect(response.statusText).toEqual("OK");
    expect(body.result).toEqual("success");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks a post api correctly", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "POST",
      status: 200,
      body: { result: "success" },
    });
    const response = await fetch(EXAMPLE_URL, { method: "POST" });
    const body = (await response.json()) as any;
    expect(response.status).toEqual(200);
    expect(response.statusText).toEqual("OK");
    expect(body.result).toEqual("success");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks a post api by matching request body", async () => {
    const matchBody = { body: "matches" };
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "POST",
      status: 200,
      body: { result: "success" },
      requestBody: matchBody,
    });
    const response = await fetch(EXAMPLE_URL, {
      method: "POST",
      body: JSON.stringify(matchBody),
    });
    const body = await response.json();
    expect(response.status).toEqual(200);
    expect(response.statusText).toEqual("OK");
    expect(body.result).toEqual("success");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mock a post api fails when request body does not match", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "POST",
      status: 200,
      body: { result: "success" },
      requestBody: { body: "match" },
    });

    await expect(() =>
      fetch(EXAMPLE_URL, {
        method: "POST",
        body: JSON.stringify({ body: "no match" }),
      })
    ).rejects.toThrowError("No match for request");
    expect(apiMock.isDone()).toEqual(false);
  });

  it("mocks the headers correctly", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "GET",
      status: 200,
      headers: { "x-example": "value1" },
      body: { result: "success" },
    });
    const response = await fetch(EXAMPLE_URL, { method: "GET" });
    const body = (await response.json()) as any;
    expect(response.status).toEqual(200);
    expect(response.statusText).toEqual("OK");
    expect(response.headers.get("x-example")).toEqual("value1");
    expect(body.result).toEqual("success");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks cookie headers correctly", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "GET",
      status: 200,
      headers: { "set-cookie": ["key1=value1", "key2=value2"] },
      body: { result: "success" },
    });
    const response = await fetch(EXAMPLE_URL, { method: "GET" });
    const body = (await response.json()) as any;
    expect(response.status).toEqual(200);
    expect(response.statusText).toEqual("OK");
    expect(response.headers.get("set-cookie")).toEqual(
      "key1=value1, key2=value2"
    );
    expect(body.result).toEqual("success");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks empty body correctly", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
    });
    const response = await fetch(EXAMPLE_URL, { method: "GET" });
    expect(response.status).toEqual(200);
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks error response correctly", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "GET",
      status: 400,
      body: { result: "failure" },
    });
    const response = await fetch(EXAMPLE_URL, { method: "GET" });
    const body = (await response.json()) as any;
    expect(response.status).toEqual(400);
    expect(body.result).toEqual("failure");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks network error correctly", async () => {
    const apiMock = mockApi({
      baseUrl: "http://localhost",
      path: "/example",
      method: "GET",
      status: 200,
      body: { result: "success" },
      networkErrorMessage: "bad network",
    });

    await expect(() =>
      fetch(EXAMPLE_URL, { method: "GET" })
    ).rejects.toThrowError("bad network");
    expect(apiMock.isDone()).toEqual(true);
  });
});

describe("mockApiFunctionBuilder()", () => {
  it("create a mock function correctly", async () => {
    const mockBuilder = mockApiFunctionBuilder({
      baseUrl: "http://localhost",
      path: "/example",
      method: "GET",
      status: 200,
      body: { result: "success" },
    });
    const apiMock = mockBuilder({ status: 201 });
    const response = await fetch(EXAMPLE_URL, { method: "GET" });
    const body = (await response.json()) as any;
    expect(response.status).toEqual(201);
    expect(response.statusText).toEqual("Created");
    expect(body.result).toEqual("success");
    expect(apiMock.isDone()).toEqual(true);
  });
});
