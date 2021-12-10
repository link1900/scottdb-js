import fetch from "node-fetch";
import { mockGraphqlApi } from "../externalGraphqlApiTestHelper";

const EXAMPLE_URL = "http://localhost/graphql";

describe("mockGraphqlApi()", () => {
  it("mocks the api correctly", async () => {
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      data: { result: "success" },
    });
    const response = await fetch(EXAMPLE_URL, { method: "POST" });
    const body = (await response.json()) as any;
    expect(response.status).toEqual(200);
    expect(response.statusText).toEqual("OK");
    expect(body.data.result).toEqual("success");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks network failure correctly", async () => {
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      status: 500,
      body: { bad: "stuff" },
    });
    const response = await fetch(EXAMPLE_URL, { method: "POST" });
    const body = await response.json();
    expect(response.status).toEqual(500);
    expect(body).toEqual({ bad: "stuff" });
    expect(apiMock.isDone()).toEqual(true);
  });

  it("mocks resolver failure correctly", async () => {
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      data: { user: null },
      errors: [
        {
          message: "cannot find user",
          locations: [{ line: 1 }],
          path: ["user"],
        },
      ],
    });
    const response = await fetch(EXAMPLE_URL, { method: "POST" });
    const body = await response.json();
    expect(response.status).toEqual(200);
    expect(body).toEqual({
      data: {
        user: null,
      },
      errors: [
        {
          locations: [
            {
              line: 1,
            },
          ],
          message: "cannot find user",
          path: ["user"],
        },
      ],
    });
    expect(apiMock.isDone()).toEqual(true);
  });
});
